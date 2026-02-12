import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip } from "@/components/StatusChip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Edit3 } from "lucide-react";
import type { StatusLevel } from "@/types/domain";

interface OcrItem {
  id: string;
  text: string;
  confidence: number;
  corrected_text: string | null;
  sort_order: number;
}

export default function OcrResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any>(null);
  const [ocrItems, setOcrItems] = useState<OcrItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("meal_analyses").select("*").eq("id", id).single(),
      supabase.from("ocr_items").select("*").eq("analysis_id", id).order("sort_order"),
    ]).then(([{ data: a }, { data: items }]) => {
      setAnalysis(a);
      setOcrItems((items as OcrItem[]) || []);
      setLoading(false);
    });
  }, [id]);

  const getConfidenceLevel = (c: number): StatusLevel => {
    if (c >= 0.9) return "low";
    if (c >= 0.75) return "medium";
    return "high";
  };

  const handleSaveEdit = async (itemId: string) => {
    const { error } = await supabase
      .from("ocr_items")
      .update({ corrected_text: editValue, corrected_by: "user" })
      .eq("id", itemId);
    if (error) {
      toast.error("수정에 실패했습니다.");
      return;
    }
    setOcrItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, corrected_text: editValue } : item))
    );
    setEditingId(null);
    toast.success("수정되었습니다.");
  };

  const handleReanalyze = async () => {
    if (!id) return;
    try {
      setReanalyzing(true);
      toast.info("AI 재분석을 시작합니다...");
      
      const { error } = await supabase.functions.invoke("analyze-meal", {
        body: { analysisId: id, mode: "analysis_only" },
      });

      if (error) throw error;

      toast.success("재분석이 완료되었습니다.");
      navigate(`/analysis/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("재분석 중 오류가 발생했습니다.");
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-heading text-xl font-semibold">분석 결과를 찾을 수 없습니다</h2>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </div>
    );
  }

  const lowConfidenceItems = ocrItems.filter((i) => i.confidence < 0.75);
  const highConfidenceItems = ocrItems.filter((i) => i.confidence >= 0.75);
  const sortedItems = [...lowConfidenceItems, ...highConfidenceItems];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">OCR 인식 결과</h1>
        <Button onClick={() => navigate(`/analysis/${id}`)} variant="ghost">
          건너뛰기 (현재 결과로 보기)
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">원본 이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={analysis.image_url}
              alt="업로드된 식단 이미지"
              className="w-full rounded-lg object-cover max-h-80"
            />
          </CardContent>
        </Card>

        {/* OCR items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              추출된 메뉴 ({ocrItems.length}개)
              {lowConfidenceItems.length > 0 && (
                <span className="ml-2 text-sm font-normal text-warning">
                  저신뢰 {lowConfidenceItems.length}개
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  item.confidence < 0.75 ? "border-warning/50 bg-warning/5" : "border-border"
                }`}
              >
                <StatusChip
                  level={getConfidenceLevel(item.confidence)}
                  label={`${Math.round(item.confidence * 100)}%`}
                />
                {editingId === item.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-9"
                    />
                    <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                      저장
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      취소
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm">
                      {item.corrected_text || item.text}
                      {item.corrected_text && (
                        <CheckCircle className="ml-1 inline h-3.5 w-3.5 text-success" />
                      )}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      aria-label="메뉴 수정"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditValue(item.corrected_text || item.text);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            {ocrItems.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                인식된 메뉴가 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate("/")}>
          새 이미지 업로드
        </Button>

        <Button onClick={handleReanalyze} disabled={reanalyzing || ocrItems.length === 0}>
          {reanalyzing ? (
            <>
              <span className="animate-spin mr-2">⏳</span> 분석 중...
            </>
          ) : (
            "수정 완료 및 AI 재분석"
          )}
        </Button>
        <Button variant="ghost" onClick={() => navigate(`/analysis/${id}`)}>
          그냥 결과 보기
        </Button>
      </div>
    </div>
  );
}
