
-- Storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);

-- Create storage policies
CREATE POLICY "Anyone can upload meal images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meal-images');

CREATE POLICY "Anyone can view meal images"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-images');

-- Meal analysis records (main table)
CREATE TABLE public.meal_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  original_filename TEXT,
  stage TEXT NOT NULL DEFAULT 'uploading' CHECK (stage IN ('uploading', 'ocr_processing', 'ai_processing', 'done', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  error_code TEXT,
  error_message TEXT,
  meal_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meal_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read meal_analyses" ON public.meal_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert meal_analyses" ON public.meal_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update meal_analyses" ON public.meal_analyses FOR UPDATE USING (true);

-- OCR extracted items
CREATE TABLE public.ocr_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.meal_analyses(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0,
  corrected_text TEXT,
  corrected_by TEXT CHECK (corrected_by IN ('user', 'admin')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ocr_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ocr_items" ON public.ocr_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ocr_items" ON public.ocr_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ocr_items" ON public.ocr_items FOR UPDATE USING (true);

-- Diet keywords extracted by AI
CREATE TABLE public.diet_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.meal_analyses(id) ON DELETE CASCADE,
  code TEXT NOT NULL CHECK (code IN ('spicy', 'salty', 'oily', 'sweet', 'acidic')),
  label TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diet_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read diet_keywords" ON public.diet_keywords FOR SELECT USING (true);
CREATE POLICY "Anyone can insert diet_keywords" ON public.diet_keywords FOR INSERT WITH CHECK (true);

-- Care recommendations
CREATE TABLE public.care_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.meal_analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.care_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read care_recommendations" ON public.care_recommendations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert care_recommendations" ON public.care_recommendations FOR INSERT WITH CHECK (true);

-- Admin keyword rules (for recommendation logic management)
CREATE TABLE public.keyword_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  diet_code TEXT NOT NULL CHECK (diet_code IN ('spicy', 'salty', 'oily', 'sweet', 'acidic')),
  weight INTEGER NOT NULL DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
  recommendation_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.keyword_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read keyword_rules" ON public.keyword_rules FOR SELECT USING (true);
CREATE POLICY "Anyone can insert keyword_rules" ON public.keyword_rules FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update keyword_rules" ON public.keyword_rules FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete keyword_rules" ON public.keyword_rules FOR DELETE USING (true);

-- Admin error logs
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES public.meal_analyses(id) ON DELETE SET NULL,
  stage TEXT NOT NULL,
  error_code TEXT,
  message TEXT NOT NULL,
  raw_message TEXT,
  meal_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read admin_logs" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert admin_logs" ON public.admin_logs FOR INSERT WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_meal_analyses_updated_at
  BEFORE UPDATE ON public.meal_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_keyword_rules_updated_at
  BEFORE UPDATE ON public.keyword_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
