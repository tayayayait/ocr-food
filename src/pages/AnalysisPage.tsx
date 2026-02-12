import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/StatusChip";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import type { StatusLevel } from "@/types/domain";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("meal_analyses").select("*").eq("id", id).single(),
      supabase.from("diet_keywords").select("*").eq("analysis_id", id),
      supabase.from("care_recommendations").select("*").eq("analysis_id", id).order("sort_order"),
    ]).then(([{ data: a }, { data: kw }, { data: rec }]) => {
      setAnalysis(a);
      setKeywords(kw || []);
      setRecommendations(rec || []);
      setLoading(false);
    });
  }, [id]);

  const getScoreLevel = (score: number): StatusLevel => {
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!analysis || analysis.stage === "failed") {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="font-heading text-xl font-semibold">AI 분석에 실패했습니다</h2>
        <p className="text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/result/${id}`)}>
            OCR 결과 확인
          </Button>
          <Button onClick={() => navigate("/")}>새 이미지 업로드</Button>
        </div>
      </div>
    );
  }

  const sortedRecs = [...recommendations].sort(
    (a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 1)
  );

  const codeLabels: Record<string, string> = {
    spicy: "매운 음식",
    salty: "짠 음식",
    oily: "기름진 음식",
    sweet: "단 음식",
    acidic: "산성 음식",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">AI 분석 결과</h1>

      {/* Summary */}
      <Card className="min-h-[120px] border-primary/20 bg-gradient-to-br from-mint-50 to-card">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold mb-1">식단 분석 요약</h2>
            <p className="text-sm text-muted-foreground">
              {keywords.length > 0
                ? `분석된 키워드 ${keywords.length}개를 기반으로 ${recommendations.length}개의 구강케어 추천을 생성했습니다.`
                : "분석 데이터가 부족합니다. 일반 구강케어 가이드를 참고해 주세요."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">식단 키워드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <StatusChip
                  key={kw.id}
                  level={getScoreLevel(kw.score)}
                  label={`${codeLabels[kw.code] || kw.label} ${kw.score}점`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          추천 구강케어
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sortedRecs.slice(0, 4).map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{rec.title}</h3>
                  <StatusChip level={rec.priority} label={rec.priority === "high" ? "높음" : rec.priority === "medium" ? "보통" : "낮음"} />
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                {rec.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {rec.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {sortedRecs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              추천 데이터가 없습니다. 일반 구강케어 가이드를 참고해 주세요.
            </CardContent>
          </Card>
        )}
      </section>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate(`/result/${id}`)}>
          OCR 결과 보기
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          새 이미지 업로드
        </Button>
        <Button onClick={() => navigate("/history")}>히스토리</Button>
      </div>
    </div>
  );
}
