import { apiClient } from "./client";
import { Source } from "../types/source";
import { PagedResponse } from "../types/paged";

export async function getSources(pageNo = 1, pageSize = 20): Promise<PagedResponse<Source>> {
  const { data } = await apiClient.get<PagedResponse<Source>>(
    `/admin/sources?pageNo=${pageNo}&pageSize=${pageSize}`
  );
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