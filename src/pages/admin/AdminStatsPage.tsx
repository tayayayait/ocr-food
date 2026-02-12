import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Calendar, AlertTriangle } from "lucide-react";

export default function AdminStatsPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    let from: Date;
    if (period === "day") {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      from = new Date(now);
      from.setDate(from.getDate() - 7);
    } else {
      from = new Date(now);
      from.setMonth(from.getMonth() - 1);
    }

    Promise.all([
      supabase.from("meal_analyses").select("id, stage, created_at").gte("created_at", from.toISOString()),
      supabase.from("admin_logs").select("stage, error_code").gte("created_at", from.toISOString()),
    ]).then(([{ data: analyses }, { data: logs }]) => {
      const total = analyses?.length || 0;
      const done = analyses?.filter((a) => a.stage === "done").length || 0;
      const failed = analyses?.filter((a) => a.stage === "failed").length || 0;

      // Error type grouping
      const errorCounts: Record<string, number> = {};
      logs?.forEach((log) => {
        const key = log.error_code || log.stage;
        errorCounts[key] = (errorCounts[key] || 0) + 1;
      });
      const topErrors = Object.entries(errorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setStats({ total, done, failed, topErrors });
      setLoading(false);
    });
  }, [period]);

  const periodLabels = { day: "일간", week: "주간", month: "월간" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">사용 통계</h1>
        <div className="flex gap-1 rounded-lg border p-1">
          {(["day", "week", "month"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "default" : "ghost"}
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">전체 분석</p>
                <p className="text-3xl font-bold font-heading">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">성공</p>
                <p className="text-3xl font-bold font-heading text-success">{stats.done}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">실패</p>
                <p className="text-3xl font-bold font-heading text-destructive">{stats.failed}</p>
              </CardContent>
            </Card>
          </div>

          {/* Simple bar chart representation */}
          {stats.total > 0 && (
            <Card className="min-h-[280px]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  성공/실패 비율
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-8 w-full overflow-hidden rounded-full mt-8">
                  <div
                    className="bg-success transition-all"
                    style={{ width: `${(stats.done / stats.total) * 100}%` }}
                  />
                  <div
                    className="bg-destructive transition-all"
                    style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                  />
                  <div className="flex-1 bg-muted" />
                </div>
                <div className="mt-8 flex gap-4 text-sm justify-center">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-success" /> 성공 {stats.done}건
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-destructive" /> 실패 {stats.failed}건
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-muted" /> 처리 중 {stats.total - stats.done - stats.failed}건
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Errors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                오류 유형 Top 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topErrors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">오류가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {stats.topErrors.map(([key, count]: [string, number]) => (
                    <div key={key} className="flex items-center justify-between rounded border p-3">
                      <span className="font-mono text-sm">{key}</span>
                      <span className="font-bold">{count}건</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
