// helper to get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// helper to remove token
export function clearToken() {
  localStorage.removeItem("token");
}