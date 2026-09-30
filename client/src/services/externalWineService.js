import { apiRequest } from "./api";

export async function searchExternalWines(query) {
  const response = await apiRequest(
    `/external-wines/search/?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.error ||
      data.detail ||
      "Unable to search external wines."
    );
  }

  return response.json();
}

export async function getExternalWineDetails(externalId) {
  const response = await apiRequest(
    `/external-wines/${externalId}/`
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.error ||
      data.detail ||
      "Unable to load external wine details."
    );
  }

  return response.json();
}

export async function importExternalWine(externalId) {
  const response = await apiRequest(
    `/external-wines/${externalId}/import/`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.error ||
      data.detail ||
      "Unable to import wine."
    );
  }

  return response.json();
}