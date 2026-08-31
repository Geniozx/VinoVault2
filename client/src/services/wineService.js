import { apiRequest } from "./api";


export async function getWines() {
  const response = await apiRequest("/wines/");

  if (!response.ok) {
    throw new Error("Unable to load wines.");
  }

  return response.json();
}