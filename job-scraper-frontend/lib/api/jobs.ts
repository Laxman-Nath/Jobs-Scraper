import { apiClient } from "./client";
import { Job } from "../types/job";
import { PagedResponse } from "../types/paged";

export async function getJobs(pageNo = 1, pageSize = 20, q?: string): Promise<PagedResponse<Job>> {
  const params = new URLSearchParams({ pageNo: String(pageNo), pageSize: String(pageSize) });
  if (q) params.set("q", q);
  const { data } = await apiClient.get<PagedResponse<Job>>(`/jobs?${params}`);
  return data;
}

export async function getJobById(id: number): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

export async function crawlSource(sourceId: number): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>(`/jobs/crawl/${sourceId}`);
  return data;
}