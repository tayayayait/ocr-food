export type ProcessStage = 'idle' | 'uploading' | 'ocr_processing' | 'ai_processing' | 'done' | 'failed';

export interface OCRMenuItem {
  id: string;
  text: string;
  confidence: number;
  correctedText?: string;
  correctedBy?: 'user' | 'admin';
}

export type DietKeywordCode = 'spicy' | 'salty' | 'oily' | 'sweet' | 'acidic';

export interface DietKeyword {
  code: DietKeywordCode;
  label: string;
  score: number;
}

export interface CareRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface AdminLogRow {
  id: string;
  createdAt: string;
  stage: Exclude<ProcessStage, 'idle' | 'done'>;
  errorCode?: string;
  message: string;
  mealDate?: string;
}

export interface ProcessResponse {
  processId: string;
  stage: ProcessStage;
  progress: number;
  ocrItems?: OCRMenuItem[];
  keywords?: DietKeyword[];
  recommendations?: CareRecommendation[];
  errorCode?: string;
}

export type StatusLevel = 'low' | 'medium' | 'high';

export interface KeywordRule {
  id: string;
  keyword: string;
  dietCode: DietKeywordCode;
  weight: number;
  recommendationText: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
