import { apiClient } from "./client";
import { Source } from "../types/source";
import { PagedResponse } from "../types/paged";

export async function getSources(pageNo = 1, pageSize = 20, q?: string): Promise<PagedResponse<Source>> {
  const params = new URLSearchParams({ pageNo: String(pageNo), pageSize: String(pageSize) });
  if (q) params.set("q", q);
  const { data } = await apiClient.get<PagedResponse<Source>>(`/admin/sources?${params.toString()}`);
console.log('Sources fetched:', data);
  return data;
}


export async function createSource(payload: Partial<Source>): Promise<Source> {
  const { data } = await apiClient.post<Source>("/admin/sources", payload);
  return data;
}

export async function updateSource(id: number, payload: Partial<Source>): Promise<Source> {
  const { data } = await apiClient.patch<Source>(`/admin/sources/${id}`, payload);
  return data;
}

export async function deleteSource(id: number): Promise<void> {
  await apiClient.delete(`/admin/sources/${id}`);
}