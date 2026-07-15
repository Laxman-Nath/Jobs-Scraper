import { apiClient } from "./client";
import { Job } from "../types/job";
import { PagedResponse } from "../types/paged";

export async function getJobs(pageNo=1,pageSize=20): Promise<PagedResponse<Job>> {
  const { data } = await apiClient.get<PagedResponse<Job>>(`/jobs?pageNo=${pageNo}&pageSize=${pageSize}`, {
    params: { pageNo, pageSize }
  });
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