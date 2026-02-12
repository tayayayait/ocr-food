import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, FileImage, AlertCircle, CheckCircle, Brain } from "lucide-react";

interface KpiData {
  totalAnalyses: number;
  todayAnalyses: number;
  successRate: number;
  failedToday: number;
}

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    Promise.all([
      supabase.from("meal_analyses").select("id", { count: "exact", head: true }),
      supabase.from("meal_analyses").select("id", { count: "exact", head: true }).gte("created_at", today),
      supabase.from("meal_analyses").select("id", { count: "exact", head: true }).eq("stage", "done"),
      supabase.from("meal_analyses").select("id", { count: "exact", head: true }).eq("stage", "failed").gte("created_at", today),
      supabase.from("admin_logs").select("*").order("created_at", { ascending: false }).limit(10),
    ]).then(([total, todayRes, success, failed, logs]) => {
      const totalCount = total.count || 0;
      const successCount = success.count || 0;
      setKpi({
        totalAnalyses: totalCount,
        todayAnalyses: todayRes.count || 0,
        successRate: totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0,
        failedToday: failed.count || 0,
      });
      setRecentLogs(logs.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: "전체 분석", value: kpi?.totalAnalyses || 0, icon: FileImage, color: "text-primary" },
    { label: "오늘 분석", value: kpi?.todayAnalyses || 0, icon: Brain, color: "text-info" },
    { label: "성공률", value: `${kpi?.successRate || 0}%`, icon: kpi?.successRate && kpi.successRate >= 80 ? TrendingUp : TrendingDown, color: (kpi?.successRate || 0) >= 80 ? "text-success" : "text-warning" },
    { label: "오늘 실패", value: kpi?.failedToday || 0, icon: AlertCircle, color: (kpi?.failedToday || 0) > 0 ? "text-destructive" : "text-success" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">관리자 대시보드</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpiItem) => {
          const Icon = kpiItem.icon;
          return (
            <Card key={kpiItem.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${kpiItem.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpiItem.label}</p>
                  <p className="text-2xl font-bold font-heading">{kpiItem.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">최근 로그</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-success" />
              <p>오류 로그가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-warning shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{log.stage}</span>
                      {log.error_code && (
                        <span className="font-mono text-xs text-destructive">{log.error_code}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("ko-KR")}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
