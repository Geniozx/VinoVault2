import { apiRequest } from "./api";


export async function getWines() {
  const response = await apiRequest("/wines/");

  if (!response.ok) {
    throw new Error("Unable to load wines.");
  }

  return response.json();
}


export async function getWineById(id) {
  const response = await apiRequest(`/wines/${id}/`);

  if (!response.ok) {
    throw new Error("Unable to load wine.");
  }

  return response.json();
}