import api from "./api";

// -------------------- Fetch Current User --------------------
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// -------------------- Update Current User --------------------
export const updateUser = async ({ username, password }) => {
  const body = {};
  if (username) body.username = username;
  if (password) body.password = password;

  const response = await api.put("/auth/me", body);
  return response.data;
};

// -------------------- Delete Current User --------------------
export const deleteUser = async () => {
  await api.delete("/auth/me");
};