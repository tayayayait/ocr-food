-- meal_analyses 테이블에 DELETE 정책 추가 (히스토리 삭제 기능 수정)
CREATE POLICY "Anyone can delete meal_analyses"
ON public.meal_analyses FOR DELETE
USING (true);

-- ocr_items, diet_keywords, care_recommendations는 ON DELETE CASCADE이므로
-- 부모(meal_analyses) 삭제 시 자동 삭제됨. 하지만 직접 삭제가 필요할 수 있으므로 정책 추가.
CREATE POLICY "Anyone can delete ocr_items"
ON public.ocr_items FOR DELETE
USING (true);

CREATE POLICY "Anyone can delete diet_keywords"
ON public.diet_keywords FOR DELETE
USING (true);

CREATE POLICY "Anyone can delete care_recommendations"
ON public.care_recommendations FOR DELETE
USING (true);

-- admin_logs도 분석 기록 삭제 시 관련 로그 정리 허용
CREATE POLICY "Anyone can delete admin_logs"
ON public.admin_logs FOR DELETE
USING (true);
