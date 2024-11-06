import { cookies } from "next/headers";

const COOKIE_MAX_AGE = 60 * 60 * 3; // 3 hours in seconds

export const setCookie = (name: string, value: string) => {
  cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
};

export const getCookie = (name: string) => {
  return cookies().get(name);
};

export const deleteCookie = (name: string) => {
  cookies().delete(name);
}; 