import { getToken } from "../../features/auth/authStorage";

const base = import.meta.env.VITE_API_URL;

/**
 * Generic API helper function for making authenticated HTTP requests.
 * Automatically includes JWT token in Authorization header if available.
 * 
 * @template T - The expected response type
 * @param path - The API endpoint path (e.g., "/users/1")
 * @param init - Optional fetch RequestInit options (method, body, headers, etc.)
 * @returns Promise resolving to the parsed JSON response of type T
 * @throws Error with message from API response or generic error message
 * 
 * @example
 * // GET request
 * const user = await api<User>("/users/1");
 * 
 * @example
 * // POST request with body
 * const newUser = await api<User>("/users", {
 *   method: "POST",
 *   body: JSON.stringify({ name: "John" })
 * });
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${base}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
      ...(!(init?.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
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