export type Source = {
  id: number;
  companyName: string;
  url: string;
  sourceType: string;
  enabled: boolean;
  status: string;
  lastError: string | null;
  jobsFoundLastRun: number;
  lastCrawledAt: string | null;
};