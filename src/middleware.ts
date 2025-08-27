import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME
  console.log(cookieName)
  const token = req.cookies.get(cookieName!);

  const authRoutes = ["/login", "/forgot-password"];

  if (token && authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/forget-password"],
};
