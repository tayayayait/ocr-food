import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Clock, FileImage, Loader2, Search, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase
      .from("meal_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (stageFilter !== "all") {
      query = query.eq("stage", stageFilter);
    }

    query.then(({ data }) => {
      setAnalyses(data || []);
      setLoading(false);
    });
  }, [stageFilter]);

  const filtered = analyses.filter((a) =>
    search ? (a.original_filename || "").toLowerCase().includes(search.toLowerCase()) : true
  );

  const handleDelete = async (analysis: any) => {
    if (!analysis?.id) return;
    const label = analysis.original_filename || "분석 기록";
    if (!window.confirm(`${label}을(를) 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(analysis.id);
    try {
      // 1. 스토리지에서 이미지 파일 삭제 시도 (실패해도 계속 진행)
      if (analysis.image_url) {
        try {
          const url = new URL(analysis.image_url);
          const pathMatch = url.pathname.match(/\/object\/public\/meal-images\/(.+)/);
          if (pathMatch) {
            await supabase.storage.from("meal-images").remove([pathMatch[1]]);
          }
        } catch (storageErr) {
          console.warn("[HistoryPage] storage delete warning:", storageErr);
        }
      }

      // 2. DB에서 분석 기록 삭제 (관련 테이블은 CASCADE로 자동 삭제)
      const { error, count } = await supabase
        .from("meal_analyses")
        .delete({ count: "exact" })
        .eq("id", analysis.id);

      if (error) {
        toast.error("삭제에 실패했습니다. 다시 시도해 주세요.");
        console.error("[HistoryPage] delete error:", error);
        return;
      }

      if (count === 0) {
        toast.error("삭제 권한이 없거나 이미 삭제된 기록입니다.");
        console.warn("[HistoryPage] delete returned 0 rows affected");
        return;
      }

      setAnalyses((prev) => prev.filter((item) => item.id !== analysis.id));
      toast.success("분석 기록을 삭제했습니다.");
    } catch (err) {
      toast.error("삭제 중 오류가 발생했습니다.");
      console.error("[HistoryPage] unexpected delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const stageLabels: Record<string, string> = {
    uploading: "업로드 중",
    ocr_processing: "OCR 처리 중",
    ai_processing: "AI 분석 중",
    done: "완료",
    failed: "실패",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">분석 히스토리</h1>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="파일명으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-14"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40 h-14">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="done">완료</SelectItem>
            <SelectItem value="failed">실패</SelectItem>
            <SelectItem value="ocr_processing">OCR 처리 중</SelectItem>
            <SelectItem value="ai_processing">AI 분석 중</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <FileImage className="h-12 w-12 text-muted-foreground" />
          <h2 className="font-heading text-xl font-semibold">분석 기록이 없습니다</h2>
          <p className="text-muted-foreground">식단 이미지를 업로드하여 첫 분석을 시작해 보세요.</p>
          <Button onClick={() => navigate("/")}>이미지 업로드</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <Card
              key={a.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              role="button"
              tabIndex={0}
              onClick={() => navigate(a.stage === "done" ? `/analysis/${a.id}` : `/result/${a.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(a.stage === "done" ? `/analysis/${a.id}` : `/result/${a.id}`)
              }
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{a.original_filename || "식단 이미지"}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString("ko-KR")}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          a.stage === "done"
                            ? "bg-success/10 text-success"
                            : a.stage === "failed"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-info/10 text-info"
                        }`}
                      >
                        {stageLabels[a.stage] || a.stage}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="분석 기록 삭제"
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDelete(a);
                    }}
                    disabled={deletingId === a.id}
                  >
                    {deletingId === a.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
