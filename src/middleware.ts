import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { accessGuid } from "./constants/global";
import { AccessItem } from "./types/global";

function findMatchedRoute(pathname: string, items: AccessItem[]): AccessItem | undefined {
  for (const item of items) {
    if (pathname.startsWith(item.path)) {
      if (item.children) {
        const childMatch = findMatchedRoute(pathname, item.children);
        return childMatch || item;
      }
      return item;
    }
  }
}

export function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;
  const { pathname } = req.nextUrl;
  const matched = findMatchedRoute(pathname, accessGuid);
  if (!matched) return NextResponse.next();
  if (!matched.authorized) {
    if (token) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }
  if (matched.authorized) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/forgot-password",
    "/clients/:path*",
    "/employees/:path*",
    "/services/:path*",
    "/categories/:path*",
  ],
};

