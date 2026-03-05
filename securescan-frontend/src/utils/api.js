const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return Promise.reject(new Error("Token expiré, redirection vers login..."));
  }

  if (!response.ok) {
    return Promise.reject(new Error(`Erreur HTTP ${response.status}`));
  }

  if (response.status === 204) {
    return Promise.resolve({});
  }

  return response.json();
}

export const api = {
  get: (endpoint, params) => {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return apiFetch(`${endpoint}${queryString}`, { method: "GET" });
  },

  post: (endpoint, body) =>
    apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    apiFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (endpoint, params) => {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return apiFetch(`${endpoint}${queryString}`, { method: "DELETE" });
  }
};