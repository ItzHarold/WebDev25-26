import { getToken } from "../../features/auth/authStorage";

const base = import.meta.env.VITE_API_URL;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message = errorData?.error || errorData?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}