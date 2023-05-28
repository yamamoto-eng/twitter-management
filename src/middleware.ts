import { getIronSession } from "iron-session/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionOptions } from "./libs/session";
import { PAGES } from "./constants";

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);
  const isAuth = !!session.id;

  if (req.nextUrl.pathname.startsWith("/callback")) {
    if (isAuth) return NextResponse.redirect(new URL(PAGES.HOME, req.url));

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith(PAGES.LOGIN) && isAuth) {
    return NextResponse.redirect(new URL(PAGES.HOME, req.url));
  }

  if (!req.nextUrl.pathname.startsWith(PAGES.LOGIN) && !isAuth) {
    return NextResponse.redirect(new URL(PAGES.LOGIN, req.url));
  }

  return NextResponse.next();
};
