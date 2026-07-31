import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_TOKEN_COOKIE } from "@/auth/config";
import { getServerToken } from "@/auth/actions";
import { useAuth } from "@/auth/store"; // Client-side store
import { clearAuthSession } from "@/auth/actions"; // Server-side clear

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as import("axios").AxiosInstance & {
  setToken: (token: string | null) => void;
};

let memoryToken: string | null = null;

apiInstance.setToken = (token: string | null) => {
  memoryToken = token;
};

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

async function getAccessToken(server: boolean) {
  if (memoryToken) return memoryToken;
  
  if (server) {
    // Server-side
    return await getServerToken();
  } else {
    // Client-side
    return Cookies.get(AUTH_TOKEN_COOKIE) || null;
  }
}

// Request interceptor → attach token
apiInstance.interceptors.request.use(async (config) => {
  const isServer = typeof window === "undefined";
  const token = await getAccessToken(isServer);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor → handle 401
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Handle custom auth logout when a 401 is encountered
      const isServer = typeof window === "undefined";

      try {
        if (!isServer) {
          // Client-side logout clears cookies and state
          await useAuth.getState().logout();
        } else {
          // Server action to clear session
          await clearAuthSession();
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
