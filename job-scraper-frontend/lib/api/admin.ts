import { AdminStats } from "../types/admin/adminstats";
import { apiClient } from "./client";



export async function getStats(): Promise<AdminStats> {
    console.log("getStats called"); 
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  console.log("Fetched admin stats:", data); // Debugging log
  return data;
}