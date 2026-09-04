import { apiRequest } from "./api";


function getAccessToken() {
  return localStorage.getItem("accessToken");
}


export async function getTastingNotes() {
  const response = await apiRequest("/tasting-notes/", {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load tasting notes.");
  }

  return response.json();
}


export async function getTastingNoteById(id) {
  const response = await apiRequest(`/tasting-notes/${id}/`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load tasting note.");
  }

  return response.json();
}


export async function createTastingNote(noteData) {
  const response = await apiRequest("/tasting-notes/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ||
      data.non_field_errors?.[0] ||
      "Unable to create tasting note."
    );
  }

  return response.json();
}


export async function updateTastingNote(id, noteData) {
  const response = await apiRequest(`/tasting-notes/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    throw new Error("Unable to update tasting note.");
  }

  return response.json();
}


export async function deleteTastingNote(id) {
  const response = await apiRequest(`/tasting-notes/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to delete tasting note.");
  }
}