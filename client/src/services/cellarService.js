import { apiRequest } from "./api";

export async function getCellarEntries() {
  const accessToken = localStorage.getItem("accessToken");

  const response = await apiRequest("/cellar/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load your cellar.");
  }

  return response.json();
}



export async function getCellarEntryById(id) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await apiRequest(`/cellar/${id}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load cellar entry.");
  }

  return response.json();
}



export async function updateCellarEntry(id, entryData) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await apiRequest(`/cellar/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    throw new Error("Unable to update cellar entry.");
  }

  return response.json();
}



export async function deleteCellarEntry(id) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await apiRequest(`/cellar/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to remove cellar entry.");
  }
}



export async function createCellarEntry(entryData) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await apiRequest("/cellar/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.non_field_errors?.[0] ||
      data.detail ||
      "Unable to add wine to cellar."
    );
  }

  return response.json();
}