import { useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadDropzoneProps {
  accept?: string[];
  maxSizeMB?: number;
  onSelectFile: (file: File) => void;
  loading?: boolean;
  className?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE_MB = 10;

export function UploadDropzone({ accept, maxSizeMB = MAX_SIZE_MB, onSelectFile, loading, className }: UploadDropzoneProps) {
  const [isDragover, setIsDragover] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      const types = accept?.map((a) => `image/${a}`) ?? ALLOWED_TYPES;
      if (!types.some((t) => file.type.startsWith(t.split("/")[0]))) {
        toast.error("지원하지 않는 파일 형식입니다. JPG, PNG, WebP 파일을 사용해 주세요.");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`파일 크기가 ${maxSizeMB}MB를 초과합니다. 더 작은 파일을 선택해 주세요.`);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onSelectFile(file);
    },
    [accept, maxSizeMB, onSelectFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragover(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  if (preview && !loading) {
    return (
      <div className={cn("relative rounded-xl border border-border overflow-hidden", className)}>
        <img src={preview} alt="업로드된 식단 이미지" className="w-full h-48 lg:h-60 object-cover" />
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3"
          onClick={() => {
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        >
          다시 선택
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-160",
        "h-[12.25rem] lg:h-[15rem]",
        isDragover ? "border-primary bg-mint-50" : "border-border bg-card",
        loading && "pointer-events-none opacity-60",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragover(true);
      }}
      onDragLeave={() => setIsDragover(false)}
      onDrop={handleDrop}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-50 text-mint-500">
        <Upload className="h-6 w-6" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        식단 이미지를 드래그하거나
        <br />
        아래 버튼으로 업로드하세요
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
          앨범에서 선택
        </Button>
        <Button variant="outline" size="sm" onClick={() => cameraInputRef.current?.click()}>
          <Camera className="h-4 w-4" />
          촬영하기
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
