import { apiRequest } from "./api";


export async function getTastingNotes() {
  const response = await apiRequest("/tasting-notes/");

  if (!response.ok) {
    throw new Error("Unable to load tasting notes.");
  }

  return response.json();
}


export async function getTastingNoteById(id) {
  const response = await apiRequest(`/tasting-notes/${id}/`);

  if (!response.ok) {
    throw new Error("Unable to load tasting note.");
  }

  return response.json();
}


export async function createTastingNote(noteData) {
  const response = await apiRequest("/tasting-notes/", {
    method: "POST",
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.rating?.[0] ||
      data.notes?.[0] ||
      data.wine_id?.[0] ||
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
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.rating?.[0] ||
      data.notes?.[0] ||
      data.wine_id?.[0] ||
      data.detail ||
      data.non_field_errors?.[0] ||
      "Unable to update tasting note."
    );
  }

  return response.json();
}


export async function deleteTastingNote(id) {
  const response = await apiRequest(`/tasting-notes/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete tasting note.");
  }
}