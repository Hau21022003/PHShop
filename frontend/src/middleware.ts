import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/orders"];
const adminPaths = ["/admin"];
const authPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sessionToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isPrivate = privatePaths.some((path) => pathname.startsWith(path));
  const isAdminPage = adminPaths.some((path) => pathname.startsWith(path));

  // Redirect nếu chưa login mà vào trang private/admin
  if ((isPrivate || isAdminPage) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đã login mà vào login/signup -> redirect về /me
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu không phải admin mà vào /admin -> redirect về 403
  if (isAdminPage && role !== "admin") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}
