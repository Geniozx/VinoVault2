import { apiRequest } from "./api";

export async function getCellarEntries() {
  const response = await apiRequest("/cellar/");

  if (!response.ok) {
    throw new Error("Unable to load your cellar.");
  }

  return response.json();
}



export async function getCellarEntryById(id) {
  const response = await apiRequest(`/cellar/${id}/`);

  if (!response.ok) {
    throw new Error("Unable to load cellar entry.");
  }

  return response.json();
}



export async function updateCellarEntry(id, entryData) {
  const response = await apiRequest(`/cellar/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.quantity?.[0] ||
      data.purchase_date?.[0] ||
      data.purchase_price?.[0] ||
      data.storage_location?.[0] ||
      data.personal_notes?.[0] ||
      data.detail ||
      data.non_field_errors?.[0] ||
      "Unable to update cellar entry."
    );
  }

  return response.json();
}



export async function deleteCellarEntry(id) {
  const response = await apiRequest(`/cellar/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to remove cellar entry.");
  }
}



export async function createCellarEntry(entryData) {
  const response = await apiRequest("/cellar/", {
    method: "POST",
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.wine_id?.[0] ||
      data.non_field_errors?.[0] ||
      data.detail ||
      "Unable to add wine to cellar."
    );
  }

  return response.json();
}