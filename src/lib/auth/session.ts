import { cookies } from 'next/headers';

export const COOKIE_NAME = 'vesak_user_session';

export interface UserSession {
  id: string;
  name: string;
  displayName: string;
}

export async function setSession(user: UserSession) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false, // Let client read it too
    sameSite: 'lax',
  });
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return JSON.parse(sessionCookie.value) as UserSession;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Client-side safe session retriever
 */
export function getClientSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const name = COOKIE_NAME + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return JSON.parse(c.substring(name.length, c.length)) as UserSession;
      }
    }
  } catch (e) {
    console.error("Error reading client session:", e);
  }
  return null;
}
