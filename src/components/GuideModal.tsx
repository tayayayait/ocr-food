import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

export function GuideModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("has-seen-guide");
    if (!hasSeenGuide) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("has-seen-guide", "true");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            식단 촬영 가이드
          </DialogTitle>
          <DialogDescription>
            정확한 분석을 위해 다음 규칙을 지켜주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">✅ 권장 사항</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>음식이 겹치지 않게 촬영해 주세요.</li>
              <li>밝은 조명 아래서 그림자 없이 찍어주세요.</li>
              <li>식판 전체가 나오도록 정면에서 찍어주세요.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-destructive">❌ 피해야 할 것</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>흔들린 사진이나 너무 어두운 사진</li>
              <li>음식의 일부가 잘린 사진</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            확인했습니다
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
