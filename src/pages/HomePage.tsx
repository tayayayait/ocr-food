import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { ProcessStage } from "@/types/domain";
import { Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { GuideModal } from "@/components/GuideModal";

export default function HomePage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<ProcessStage>("idle");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [longWaitMsg, setLongWaitMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("meal_analyses")
      .select("id, stage, original_filename, created_at, meal_date")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setRecentAnalyses(data);
      });
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      setStage("uploading");
      setLongWaitMsg(null);

      // Start timers for long wait messages
      const t3 = setTimeout(() => setLongWaitMsg("처리 중입니다. 잠시만 기다려 주세요."), 3000);
      const t8 = setTimeout(() => setLongWaitMsg("처리가 길어지고 있습니다. 결과는 자동으로 저장됩니다."), 8000);

      try {
        // Upload image
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("meal-images").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("meal-images").getPublicUrl(path);

        // Create analysis record
        const { data: analysis, error: insertError } = await supabase
          .from("meal_analyses")
          .insert({
            image_url: urlData.publicUrl,
            original_filename: file.name,
            stage: "uploading",
            progress: 10,
          })
          .select()
          .single();
        if (insertError) throw insertError;

        setAnalysisId(analysis.id);
        setStage("ocr_processing");

        // Call AI edge function
        const { data: fnData, error: fnError } = await supabase.functions.invoke("analyze-meal", {
          body: { analysisId: analysis.id, imageUrl: urlData.publicUrl },
        });

        if (fnError) throw fnError;

        setStage("done");
        clearTimeout(t3);
        clearTimeout(t8);
        setLongWaitMsg(null);

        // Navigate to results
        setTimeout(() => navigate(`/result/${analysis.id}`), 500);
      } catch (err: any) {
        clearTimeout(t3);
        clearTimeout(t8);
        setStage("failed");
        toast.error("처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        console.error(err);
      }
    },
    [navigate]
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-mint-50 to-blue-50 p-6 lg:p-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
          식단 사진으로 구강케어 추천받기
        </h1>
        <p className="text-muted-foreground mb-6">
          식단 이미지를 업로드하면 AI가 음식을 분석하고, 맞춤 구강케어를 추천해 드립니다.
        </p>
      </section>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl">이미지 업로드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadDropzone onSelectFile={handleUpload} loading={stage !== "idle" && stage !== "failed"} />

          {stage !== "idle" && (
            <div className="space-y-3">
              <ProcessSteps currentStage={stage} />
              {longWaitMsg && (
                <p className="text-sm text-muted-foreground text-center animate-in fade-in">{longWaitMsg}</p>
              )}
              {stage === "failed" && (
                <div className="flex justify-center">
                  <Button onClick={() => setStage("idle")} variant="outline">
                    다시 시도
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent */}
      {recentAnalyses.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">최근 분석</h2>
          <div className="grid gap-3">
            {recentAnalyses.map((a) => (
              <Card
                key={a.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/result/${a.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/result/${a.id}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{a.original_filename || "식단 이미지"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <GuideModal />
    </div>
  );
}
