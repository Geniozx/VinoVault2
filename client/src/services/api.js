const API_URL = import.meta.env.VITE_API_URL;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to refresh access token.");
  }

  const data = await response.json();

  localStorage.setItem("accessToken", data.access);

  if (data.refresh) {
    localStorage.setItem("refreshToken", data.refresh);
  }

  return data.access;
}

export async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const makeRequest = (token) => {
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });
  };

  let response = await makeRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return response;
  }

  try {
    const newAccessToken = await refreshAccessToken();

    response = await makeRequest(newAccessToken);

    return response;
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return response;
  }
}