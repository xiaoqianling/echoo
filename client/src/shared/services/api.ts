import {
  AuthResponse,
  LoginForm,
  RegisterForm,
  Message,
  Organization,
  User,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class ApiService {}

export const apiService = new ApiService();
