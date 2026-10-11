import Cookies from "js-cookie";
import { ApiEnvelope, Role, User } from "@/types";
import { api } from "./api";

interface AuthResponse {
  token: string;
  user: User;
}

const persistSession = (token: string, role: Role): void => {
  Cookies.set("token", token, { expires: 7, sameSite: "lax" });
  Cookies.set("role", role, { expires: 7, sameSite: "lax" });
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<ApiEnvelope<AuthResponse>>("/auth/login", { email, password });
  persistSession(data.data.token, data.data.user.role);
  return data.data.user;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const { data } = await api.post<ApiEnvelope<AuthResponse>>("/auth/register", {
    name,
    email,
    password,
  });
  persistSession(data.data.token, data.data.user.role);
  return data.data.user;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");
  return data.data.user;
};

export const logout = (): void => {
  Cookies.remove("token");
  Cookies.remove("role");
  window.location.href = "/login";
};
