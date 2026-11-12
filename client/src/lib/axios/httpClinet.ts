"use client";

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeBaseUrl(raw?: string): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("//")) {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}${value}`;
    }
    return `https:${value}`;
  }

  const isLocalHost = /^(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(value);
  return `${isLocalHost ? "http" : "https"}://${value}`;
}

export class HttpError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

type ApiErrorShape = {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string }>;
};

function normalizeError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorShape>;
    const status = axiosError.response?.status;
    const payload = axiosError.response?.data;
    // Log raw axios error for easier debugging in dev
    try {
      // logging removed
    } catch (e) {
      // ignore
    }

    const message =
      payload?.message ||
      payload?.error ||
      payload?.errors?.[0]?.message ||
      axiosError.message ||
      "Request failed";

    return new HttpError(message, status, payload);
  }

  if (error instanceof Error) {
    return new HttpError(error.message);
  }

  return new HttpError("Unexpected request error");
}

const AUTH_SESSION_CACHE_KEY = "techstore.auth.session";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getLocalAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.accessToken === "string") {
        return parsed.accessToken;
      }
    }
  } catch {
    // ignore
  }
  return getCookie("accessToken");
}

function getLocalRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.refreshToken === "string") {
        return parsed.refreshToken;
      }
    }
  } catch {
    // ignore
  }
  return getCookie("refreshToken");
}

const instance = axios.create({
  baseURL: normalizeBaseUrl(API_URL ? `${API_URL.replace(/\/$/, "")}/api/v1` : undefined),
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization Bearer token from localStorage/cookies
instance.interceptors.request.use((config) => {
  const token = getLocalAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Dev-only request logging to help debug cookie/session issues (401s)
if (process.env.NODE_ENV !== "production") {
  instance.interceptors.request.use((config) => {
    try {
      const url = config.url ?? "";
      if (url.includes("/auth") || url.includes("get-me") || url.includes("refresh-token")) {
        // Note: HttpOnly cookies won't appear in document.cookie, but will be sent by the browser.
        // Inspect Network -> Request Headers -> Cookie to see actual cookies sent.
        // We still log document.cookie for non-HttpOnly tokens stored in JS (if any).
        // eslint-disable-next-line no-console
        console.debug("[httpClient] Dev debug - document.cookie:", typeof document !== "undefined" ? document.cookie : "<no document>");
        // eslint-disable-next-line no-console
        console.debug("[httpClient] Dev debug - request config:", { url: config.url, method: config.method, headers: config.headers, withCredentials: config.withCredentials });
      }
    } catch (err) {
      // ignore
    }

    return config;
  });
}

// Track if we're currently refreshing tokens to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const subscribeTokenRefresh = (resolve: (token: string) => void, reject: (err: unknown) => void) => {
  refreshSubscribers.push({ resolve, reject });
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (err: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
};

// Response interceptor for handling session refresh
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check for X-Session-Refresh header
    const sessionRefreshHeader = response.headers["x-session-refresh"];

    if (sessionRefreshHeader === "true") {
      // Token refresh is needed, but we'll let the client handle it
      // Store this info for the app to handle
      (response.config as unknown as Record<string, unknown>).metadata = { sessionRefreshNeeded: true };
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors (token expired)
    // Skip refresh for auth routes — these should just fail immediately
    const url = error.config?.url || "";
    const isAuthRoute = url.includes("/auth/refresh-token") || url.includes("/auth/me") || url.includes("/auth/login");

    if (error.response?.status === 401 && !isAuthRoute) {
      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = getLocalRefreshToken();

        // Attempt to refresh token
        instance
          .post("/auth/refresh-token", { refreshToken })
          .then((response) => {
            isRefreshing = false;
            const newAccessToken = response.data?.data?.accessToken || "";
            const newRefreshToken = response.data?.data?.refreshToken || "";

            // Save new tokens to storage
            if (typeof window !== "undefined" && newAccessToken) {
              try {
                const raw = window.localStorage.getItem(AUTH_SESSION_CACHE_KEY);
                if (raw) {
                  const parsed = JSON.parse(raw);
                  parsed.accessToken = newAccessToken;
                  if (newRefreshToken) {
                    parsed.refreshToken = newRefreshToken;
                  }
                  parsed.cachedAt = new Date().toISOString();
                  window.localStorage.setItem(AUTH_SESSION_CACHE_KEY, JSON.stringify(parsed));
                }
              } catch (e) {
                // ignore
              }

              // Also update cookies for backward compat
              const expires = new Date(Date.now() + 20 * 864e5).toUTCString();
              document.cookie = `accessToken=${encodeURIComponent(newAccessToken)}; expires=${expires}; path=/;`;
              if (newRefreshToken) {
                document.cookie = `refreshToken=${encodeURIComponent(newRefreshToken)}; expires=${expires}; path=/;`;
              }
            }

            onRefreshed(newAccessToken);
          })
          .catch((refreshError) => {
            isRefreshing = false;
            onRefreshFailed(refreshError);
          });
      }

      // Queue the original request
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(
          () => resolve(instance(error.config!)),
          (refreshError) => reject(refreshError)
        );
      });
    }

    return Promise.reject(error);
  }
);

function withAuth(config?: AxiosRequestConfig, token?: string): AxiosRequestConfig {
  if (!token) {
    return config ?? {};
  }

  return {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

async function get<TData>(url: string, config?: AxiosRequestConfig, token?: string): Promise<TData> {
  try {
    const response = await instance.get<TData>(url, withAuth(config, token));
    return response.data;
  } catch (error) {
    // logging removed
    throw normalizeError(error);
  }
}

async function post<TData, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
  token?: string
): Promise<TData> {
  try {

    const finalConfig = withAuth(config, token);

    const response = await instance.post<TData>(url, body, finalConfig);


    return response.data;
  } catch (error) {
    // logging removed
    throw normalizeError(error);
  }
}

async function put<TData, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
  token?: string
): Promise<TData> {
  try {
    const response = await instance.put<TData>(url, body, withAuth(config, token));
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function patch<TData, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
  token?: string
): Promise<TData> {
  try {
    // Defensive: callers sometimes pass an AxiosRequestConfig as the second
    // argument (intending it to be `config`). Detect that case and shift
    // arguments so the config is not sent as the JSON request body.
    let bodyToSend: unknown = body;
    let configToUse: AxiosRequestConfig | undefined = config;

    if (body && typeof body === "object" && !Array.isArray(body)) {
      const maybe = body as Record<string, unknown>;
      const configLikeKeys = ["params", "headers", "auth", "timeout", "baseURL", "onUploadProgress", "onDownloadProgress", "maxContentLength", "paramsSerializer", "body", "query"];
      if (configLikeKeys.some(k => Object.prototype.hasOwnProperty.call(maybe, k))) {
        configToUse = maybe as AxiosRequestConfig;
        bodyToSend = undefined;
      }
    }

    const response = await instance.patch<TData>(url, bodyToSend as any, withAuth(configToUse, token));
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function remove<TData>(url: string, config?: AxiosRequestConfig, token?: string): Promise<TData> {
  try {
    const response = await instance.delete<TData>(url, withAuth(config, token));
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const httpClient = {
  get,
  post,
  put,
  patch,
  delete: remove,
};
