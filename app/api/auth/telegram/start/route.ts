import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
  const insertResponse = await supabaseAdmin
    .from("telegram_auth_states")
    .insert({
      state,
      return_to: safeReturnTo,
      created_at: new Date().toISOString(),
    });

  if (insertResponse.error) {
    return NextResponse.json(
      { error: insertResponse.error.message },
      { status: 500 },
    );
  }

  const startParam = `login_${state}`;
  const redirectUrl = `https://t.me/${botUsername}?start=${encodeURIComponent(
    startParam,
  )}`;

  return NextResponse.redirect(redirectUrl);
};
