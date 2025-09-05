import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;

  const authPages = ["/login", "/forgot-password"];
  const protectedPages = ["/employees", "/clients"];

  const { pathname } = req.nextUrl;

  if (token) {
    if (authPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    if (protectedPages.some((page) => pathname.startsWith(page))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/forgot-password", "/employees/:path*", "/clients/:path"],
};
