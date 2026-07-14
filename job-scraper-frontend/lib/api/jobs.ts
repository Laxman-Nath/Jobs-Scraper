import { apiClient } from "./client";
import { Job } from "../types/job";

export async function getJobs(): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>("/jobs");
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