export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  description: string | null;
  postedAt: string | null;
  status: string;
};