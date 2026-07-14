import { apiClient } from "./client";
import { Source } from "../types/source";

export async function getSources(): Promise<Source[]> {
  const { data } = await apiClient.get<Source[]>("/admin/sources");
  console.log("Fetched sources:", data); // Debugging log
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