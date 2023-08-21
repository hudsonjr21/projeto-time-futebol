import { parseCookies } from 'nookies';

export function canAccessAdmin(): boolean {
  const cookies = parseCookies();
  const userRole = cookies['@nextauth.role'];

  return userRole === 'admin';
}