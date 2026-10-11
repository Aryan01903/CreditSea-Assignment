import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

const homeFor = (role: string): string => {
  if (role === "borrower") return "/portal";
  if (role === "admin") return "/dashboard/sales";
  return `/dashboard/${role}`;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublic || pathname === "/") {
    return NextResponse.redirect(new URL(homeFor(role ?? "borrower"), request.url));
  }

  if (pathname.startsWith("/portal") && role !== "borrower") {
    return NextResponse.redirect(new URL(homeFor(role ?? "borrower"), request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (role === "borrower") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    if (role !== "admin") {
      const module = pathname.split("/")[2];
      if (module && module !== role) {
        return NextResponse.redirect(new URL(homeFor(role ?? "borrower"), request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
