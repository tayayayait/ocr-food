import { cn } from "@/lib/utils";
import type { ProcessStage } from "@/types/domain";
import { Upload, Eye, Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const steps: { stage: ProcessStage; label: string; icon: React.ElementType }[] = [
  { stage: "uploading", label: "업로드", icon: Upload },
  { stage: "ocr_processing", label: "OCR 인식", icon: Eye },
  { stage: "ai_processing", label: "AI 분석", icon: Brain },
  { stage: "done", label: "완료", icon: CheckCircle },
];

const stageOrder: ProcessStage[] = ["uploading", "ocr_processing", "ai_processing", "done"];

interface ProcessStepsProps {
  currentStage: ProcessStage;
  className?: string;
}

export function ProcessSteps({ currentStage, className }: ProcessStepsProps) {
  const currentIdx = stageOrder.indexOf(currentStage);
  const isFailed = currentStage === "failed";

  return (
    <div className={cn("flex items-center gap-2", className)} role="status">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentIdx;
        const isDone = idx < currentIdx;
        const isCurrent = isActive && !isFailed;

        return (
          <div key={step.stage} className="flex items-center gap-2">
            {idx > 0 && (
              <div className={cn("h-0.5 w-6 rounded-full transition-colors", isDone ? "bg-primary" : "bg-border")} />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-mint-50 text-primary",
                  !isDone && !isCurrent && "border-border bg-card text-muted-foreground",
                  isFailed && isActive && "border-destructive bg-destructive/10 text-destructive"
                )}
              >
                {isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isFailed && isActive ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={cn("text-xs font-medium", isDone || isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
