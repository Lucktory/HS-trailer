import { NextResponse, type NextRequest } from "next/server";

// Los ids de /flota son siempre en minúscula. Una URL con mayúsculas se redirige antes de renderizarse:
// en servidores con disco que no distingue mayúsculas (Windows/macOS) pisaba la ficha real con la 404.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!/[A-Z]/.test(pathname)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: "/flota/:path*" };
