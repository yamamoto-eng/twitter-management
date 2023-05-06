import { getIronSession } from "iron-session/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionOptions } from "./libs/session";

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);
  const isAuth = !!session.accessToken;

  if (req.nextUrl.pathname.startsWith("/callback")) {
    if (isAuth) return NextResponse.redirect(new URL("/", req.url));

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/login") && isAuth) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!req.nextUrl.pathname.startsWith("/login") && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};
