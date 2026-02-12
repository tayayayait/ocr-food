import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusChip } from "@/components/StatusChip";
import { CheckCircle, XCircle, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import type { StatusLevel } from "@/types/domain";

export default function AdminOcrPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ocrItems, setOcrItems] = useState<any[]>([]);

  const fetchData = () => {
    setLoading(true);
    let query = supabase.from("meal_analyses").select("*").order("created_at", { ascending: false }).limit(50);
    if (filter !== "all") query = query.eq("stage", filter);
    query.then(({ data }) => {
      setAnalyses(data || []);
      setLoading(false);
    });
  };

  useEffect(fetchData, [filter]);

  const handleViewOcr = async (id: string) => {
    setSelectedId(id);
    const { data } = await supabase.from("ocr_items").select("*").eq("analysis_id", id).order("sort_order");
    setOcrItems(data || []);
  };

  const handleUpdateStage = async (id: string, stage: string, mode: "full" | "analysis_only" = "full") => {
    if (stage === "ocr_processing" && mode === "analysis_only") {
      // For analysis only, we trigger the edge function directly
      toast.info("AI 재분석(OCR 건너뛰기)을 요청합니다...");
      const { error } = await supabase.functions.invoke("analyze-meal", {
        body: { analysisId: id, mode: "analysis_only" },
      });
      if (error) {
        toast.error("재분석 요청 실패: " + error.message);
        return;
      }
      toast.success("재분석이 시작되었습니다.");
      fetchData();
      return;
    }

    const { error } = await supabase.from("meal_analyses").update({ stage }).eq("id", id);
    if (error) {
      toast.error("상태 변경에 실패했습니다.");
      return;
    }
    toast.success(`상태가 ${stage}로 변경되었습니다.`);
    fetchData();
  };

  const stageLabels: Record<string, string> = {
    uploading: "업로드 중",
    ocr_processing: "OCR 처리 중",
    ai_processing: "AI 분석 중",
    done: "완료",
    failed: "실패",
  };

  const stageLevel = (s: string): StatusLevel => {
    if (s === "done") return "low";
    if (s === "failed") return "high";
    return "medium";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">식단표/OCR 관리</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="done">완료</SelectItem>
            <SelectItem value="failed">실패</SelectItem>
            <SelectItem value="ocr_processing">OCR 처리 중</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* List */}
          <div className="lg:col-span-5 space-y-2">
            {analyses.map((a) => (
              <Card
                key={a.id}
                className={`cursor-pointer transition-shadow hover:shadow-md ${selectedId === a.id ? "ring-2 ring-primary" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => handleViewOcr(a.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleViewOcr(a.id);
                  }
                }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{a.original_filename || "식단 이미지"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("ko-KR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusChip level={stageLevel(a.stage)} label={stageLabels[a.stage] || a.stage} />
                  </div>
                </CardContent>
              </Card>
            ))}
            {analyses.length === 0 && <p className="text-center text-muted-foreground py-8">데이터가 없습니다.</p>}
          </div>

          {/* Detail */}
          {selectedId && (
            <div className="lg:col-span-7">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    OCR 상세
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const a = analyses.find((x) => x.id === selectedId);
                    if (!a) return null;
                    return (
                      <>
                        <img src={a.image_url} alt="원본" className="w-full rounded-lg max-h-80 object-cover" />
                        <div className="space-y-2">
                          {ocrItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 rounded border p-2 text-sm">
                              <StatusChip
                                level={item.confidence >= 0.75 ? "low" : "high"}
                                label={`${Math.round(item.confidence * 100)}%`}
                              />
                              <span>{item.corrected_text || item.text}</span>
                            </div>
                          ))}
                          {ocrItems.length === 0 && <p className="text-muted-foreground text-sm">OCR 항목 없음</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStage(a.id, "done")}>
                            <CheckCircle className="h-4 w-4" /> 승인
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStage(a.id, "failed")}>
                            <XCircle className="h-4 w-4" /> 반려
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStage(a.id, "ocr_processing", "full")}>
                            <RefreshCw className="h-4 w-4" /> 전체 재처리
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStage(a.id, "ocr_processing", "analysis_only")}>
                            <RefreshCw className="h-4 w-4" /> AI만 재분석
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
