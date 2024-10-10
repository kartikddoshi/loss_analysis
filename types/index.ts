export type UploadMode = 'add' | 'replace';

export interface AnalysisData {
  item_no: string;
  date: Date;
  kt?: number;
  karigar?: string;
  process?: string;
  loss?: number;
  gross_wt?: number;
  net_wt?: number;
  // Add other fields as necessary
}

export interface UploadStore {
  lossFile: File | null;
  weightFile: File | null;
  uploadMode: UploadMode;
  setLossFile: (file: File | null) => void;
  setWeightFile: (file: File | null) => void;
  setUploadMode: (mode: UploadMode) => void;
  handleUpload: () => Promise<void>;
  handleClearDatabase: () => Promise<void>;
}