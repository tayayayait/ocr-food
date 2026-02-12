import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { DietKeywordCode } from "@/types/domain";

interface KeywordRule {
  id: string;
  keyword: string;
  diet_code: string;
  weight: number;
  recommendation_text: string;
  is_active: boolean;
  version: number;
}

const dietCodes: { value: DietKeywordCode; label: string }[] = [
  { value: "spicy", label: "매운 음식" },
  { value: "salty", label: "짠 음식" },
  { value: "oily", label: "기름진 음식" },
  { value: "sweet", label: "단 음식" },
  { value: "acidic", label: "산성 음식" },
];

export default function AdminKeywordsPage() {
  const [rules, setRules] = useState<KeywordRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRule, setEditRule] = useState<Partial<KeywordRule> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchRules = () => {
    setLoading(true);
    supabase
      .from("keyword_rules")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRules((data as KeywordRule[]) || []);
        setLoading(false);
      });
  };

  useEffect(fetchRules, []);

  const openAdd = () => {
    setEditRule({ keyword: "", diet_code: "spicy", weight: 50, recommendation_text: "", is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (rule: KeywordRule) => {
    setEditRule({ ...rule });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editRule?.keyword || !editRule?.recommendation_text) {
      toast.error("키워드와 추천 문구를 입력해 주세요.");
      return;
    }
    setSaving(true);
    if (editRule.id) {
      const { error } = await supabase
        .from("keyword_rules")
        .update({
          keyword: editRule.keyword,
          diet_code: editRule.diet_code,
          weight: editRule.weight,
          recommendation_text: editRule.recommendation_text,
          is_active: editRule.is_active,
        })
        .eq("id", editRule.id);
      if (error) toast.error("수정에 실패했습니다.");
      else toast.success("규칙이 수정되었습니다.");
    } else {
      const { error } = await supabase.from("keyword_rules").insert({
        keyword: editRule.keyword,
        diet_code: editRule.diet_code,
        weight: editRule.weight,
        recommendation_text: editRule.recommendation_text,
        is_active: editRule.is_active,
      });
      if (error) toast.error("추가에 실패했습니다.");
      else toast.success("규칙이 추가되었습니다.");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("keyword_rules").delete().eq("id", id);
    if (error) toast.error("삭제에 실패했습니다.");
    else toast.success("규칙이 삭제되었습니다.");
    setDeleteConfirm(null);
    fetchRules();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">키워드·추천 로직 관리</h1>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> 규칙 추가
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            등록된 키워드 규칙이 없습니다. 규칙을 추가해 주세요.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <Card key={rule.id} className={!rule.is_active ? "opacity-50" : ""}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{rule.keyword}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {dietCodes.find((d) => d.value === rule.diet_code)?.label}
                    </span>
                    <span className="text-xs text-muted-foreground">가중치 {rule.weight}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.recommendation_text}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(rule)} aria-label="수정">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(rule.id)} aria-label="삭제">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRule?.id ? "규칙 수정" : "규칙 추가"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">키워드</Label>
              <Input
                id="keyword"
                value={editRule?.keyword || ""}
                onChange={(e) => setEditRule((p) => ({ ...p, keyword: e.target.value }))}
                placeholder="예: 고추장"
              />
            </div>
            <div className="space-y-2">
              <Label>식단 코드</Label>
              <Select
                value={editRule?.diet_code || "spicy"}
                onValueChange={(v) => setEditRule((p) => ({ ...p, diet_code: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietCodes.map((dc) => (
                    <SelectItem key={dc.value} value={dc.value}>
                      {dc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>가중치: {editRule?.weight || 50}</Label>
              <Slider
                value={[editRule?.weight || 50]}
                onValueChange={([v]) => setEditRule((p) => ({ ...p, weight: v }))}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rec">추천 문구</Label>
              <Input
                id="rec"
                value={editRule?.recommendation_text || ""}
                onChange={(e) => setEditRule((p) => ({ ...p, recommendation_text: e.target.value }))}
                placeholder="예: 칫솔질 후 가글을 추천합니다"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={editRule?.is_active ?? true}
                onCheckedChange={(v) => setEditRule((p) => ({ ...p, is_active: v }))}
              />
              <Label>활성화</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>규칙 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">이 규칙을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
