import { apiRequest } from "./api";

export async function searchExternalWines(query) {
  const response = await apiRequest(
    `/external-wines/search/?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Unable to search external wines.");
  }

  return response.json();
}

export async function getExternalWineDetails(externalId) {
  const response = await apiRequest(
    `/external-wines/${externalId}/`
  );

  if (!response.ok) {
    throw new Error("Unable to load external wine details.");
  }

  return response.json();
}

export async function importExternalWine(externalId) {
  const token = localStorage.getItem("accessToken");

  const response = await apiRequest(
    `/external-wines/${externalId}/import/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to import wine.");
  }

  return response.json();
}