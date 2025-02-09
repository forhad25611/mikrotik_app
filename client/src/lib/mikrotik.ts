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

export interface PPPoEUserStatus {
  username: string;
  isOnline: boolean;
  uptime?: string;
  address?: string;
  callerId?: string;
  txBytes?: string;
  rxBytes?: string;
}

const API_BASE = '/api/router';

export async function authenticateRouter(username: string, password: string) {
  const response = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Authentication failed');
  }
  return response.json();
}

export async function fetchRouterInfo() {
  const response = await fetch(`${API_BASE}/info`);
  if (!response.ok) {
    throw new Error('Failed to fetch router info');
  }
  return response.json();
}

export async function fetchPPPoEUsers() {
  const response = await fetch(`${API_BASE}/pppoe-users`);
  if (!response.ok) {
    throw new Error('Failed to fetch PPPoE users');
  }
  return response.json();
}