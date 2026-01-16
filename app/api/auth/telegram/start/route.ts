import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const isSafeReturnTo = (returnTo: string | null) => {
  if (!returnTo) {
    return false;
  }

  return returnTo.startsWith("/") && !returnTo.startsWith("//");
};

export const GET = async (request: NextRequest) => {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;

  if (!botUsername) {
    return NextResponse.json(
      { error: "Missing TELEGRAM_BOT_USERNAME" },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  const returnTo = request.nextUrl.searchParams.get("returnTo");
  const safeReturnTo = isSafeReturnTo(returnTo) ? returnTo : null;
  const cookieStore = await cookies();

  cookieStore.set("tg_auth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  if (safeReturnTo) {
    cookieStore.set("tg_auth_return_to", safeReturnTo, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  }

  const startParam = `login_${state}`;
  const redirectUrl = `https://t.me/${botUsername}?start=${encodeURIComponent(
    startParam,
  )}`;

  return NextResponse.redirect(redirectUrl);
};
