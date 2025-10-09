import api from "./axios";

export async function loginUser(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const { access_token } = res.data;
  localStorage.setItem("token", access_token);
  return res.data;
}

export async function registerUser(email: string, password: string) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem("token");
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}
