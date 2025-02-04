import { apiRequest } from "./queryClient";

export interface RouterCredentials {
  ip: string;
  username: string;
  password: string;
}

export interface RouterInfo {
  identity: string;
  version: string;
  uptime: string;
  cpuLoad: string;
  memoryUsed: string;
}

export async function authenticateRouter(credentials: RouterCredentials) {
  const response = await apiRequest(
    "POST",
    "/api/router/auth",
    credentials
  );
  return response.json();
}

export async function getRouterInfo(ip: string) {
  const response = await apiRequest(
    "GET",
    `/api/router/info?ip=${encodeURIComponent(ip)}`
  );
  return response.json() as Promise<RouterInfo>;
}
