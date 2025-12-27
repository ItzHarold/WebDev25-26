import { getToken } from "../../features/auth/authStorage";

const base = import.meta.env.VITE_API_URL;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json",
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}