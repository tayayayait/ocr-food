-- Create keyword_rules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.keyword_rules (
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

-- Enable RLS
ALTER TABLE public.keyword_rules ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'keyword_rules' AND policyname = 'Anyone can read keyword_rules'
    ) THEN
        CREATE POLICY "Anyone can read keyword_rules" ON public.keyword_rules FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'keyword_rules' AND policyname = 'Anyone can insert keyword_rules'
    ) THEN
        CREATE POLICY "Anyone can insert keyword_rules" ON public.keyword_rules FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'keyword_rules' AND policyname = 'Anyone can update keyword_rules'
    ) THEN
        CREATE POLICY "Anyone can update keyword_rules" ON public.keyword_rules FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'keyword_rules' AND policyname = 'Anyone can delete keyword_rules'
    ) THEN
        CREATE POLICY "Anyone can delete keyword_rules" ON public.keyword_rules FOR DELETE USING (true);
    END IF;
END
$$;

-- Create trigger for updated_at if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_keyword_rules_updated_at'
    ) THEN
        CREATE TRIGGER update_keyword_rules_updated_at
        BEFORE UPDATE ON public.keyword_rules
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;
