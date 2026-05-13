import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../config/auth";

export async function apiFetch(url, options = {}, onSessionExpired) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    if (typeof onSessionExpired === "function") {
      onSessionExpired();
    }

    throw new Error("Sesi login kamu sudah habis. Silakan login ulang.");
  }

  return response;
}
