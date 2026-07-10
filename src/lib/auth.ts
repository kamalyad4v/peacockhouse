// Auth utilities - client side
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('pk_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pk_token');
}

export function setSession(token: string, user: User) {
  localStorage.setItem('pk_token', token);
  localStorage.setItem('pk_user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('pk_token');
  localStorage.removeItem('pk_user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}
