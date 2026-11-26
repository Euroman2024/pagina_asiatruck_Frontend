const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    /** Código de error del backend, p. ej. "EMAIL_NO_VERIFICADO" */
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    let message = `${init?.method ?? "GET"} ${path} failed with ${res.status}`;
    let code: string | undefined;
    try {
      const body = JSON.parse(text) as { message?: string | string[]; code?: string };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(". ") : body.message;
      }
      code = body?.code;
    } catch {
      // el body de error no era JSON, se mantiene el mensaje genérico
    }
    throw new ApiError(res.status, message, code);
  }

  if (text.length === 0) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => apiFetch<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => apiFetch<T>(path, { ...init, method: "DELETE" }),
};
