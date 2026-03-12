import axios from 'axios';
import type { AxiosError } from 'axios';
import type { LoginCredentials, RegisterCredentials, TokenResponse, AuthUser } from '../types';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function extractErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ detail: string | Array<{ msg: string }> }>;
  const detail = axiosError?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join('. ');
  return fallback;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const { data } = await client.post<TokenResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return data;
  },

  async register(credentials: Omit<RegisterCredentials, 'confirmPassword'>): Promise<{ message: string }> {
    const { data } = await client.post<{ message: string }>('/auth/register', {
      email: credentials.email,
      password: credentials.password,
    });
    return data;
  },

  async getMe(token: string): Promise<AuthUser> {
    const { data } = await client.get<AuthUser>('/protected/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
