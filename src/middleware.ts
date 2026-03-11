import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { accessGuid } from "./constants/global";
import { AccessItem, ROLE } from "./types/global";
import { validateAuthenticationWithCaching } from "./api-client";

function findMatchedRoute(pathname: string, items: AccessItem[], parent?: AccessItem): { authorized: boolean; path: string; roles: ROLE[] } | undefined {
  for (const item of items) {
    const fullPath = parent
      ? `${parent.path}${item.path}`
      : item.path;

    if (pathname === fullPath || pathname.startsWith(fullPath + "/")) {
      const roles =
        item.roles.length > 0
          ? item.roles
          : parent?.roles ?? [];

      if (item.children) {
        const childMatch = findMatchedRoute(
          pathname,
          item.children,
          { ...item, path: fullPath, roles }
        );
        if (childMatch) return childMatch;
      }

      return {
        authorized: item.authorized,
        path: fullPath,
        roles,
      };
    }
  }
}

export async function middleware(req: NextRequest) {
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
    const reqAuth = await validateAuthenticationWithCaching(token)
    const role = reqAuth?.data.role as ROLE;

    if (matched.roles.length > 0 && (!role || !matched.roles.includes(role)))
      return NextResponse.redirect(new URL("/not-found", req.url));

    return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/login",
    "/forgot-password",
    "/dashboard/:path*"
  ],
};

