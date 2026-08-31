import { apiRequest } from "./api";

export async function loginUser(credentials) {
  const response = await apiRequest("/auth/token/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password.");
  }

  return response.json();
}



export async function getCurrentUser(accessToken) {
  const response = await apiRequest("/auth/me/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load current user.");
  }

  return response.json();
}



export async function registerUser(userData) {
  const response = await apiRequest("/auth/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.username?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      "Unable to create account."
    );
  }

  return response.json();
}



export async function logoutUser(accessToken, refreshToken) {
  const response = await apiRequest("/auth/logout/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to log out.");
  }

  return response.json();
}