let accessToken: string | null = null;
let userRole: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setUserRole(role: string | null) {
  userRole = role;
}

export function getUserRole(): string | null {
  return userRole;
}