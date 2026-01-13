import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type TelegramAuthPayload = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
};

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

const normalizeTelegramPayload = (
  payload: TelegramAuthPayload
): Record<string, string> => ({
  auth_date: String(payload.auth_date),
  first_name: payload.first_name ?? "",
  id: String(payload.id),
  last_name: payload.last_name ?? "",
  photo_url: payload.photo_url ?? "",
  username: payload.username ?? "",
});

const buildDataCheckString = (data: Record<string, string>) =>
  Object.keys(data)
    .filter((key) => data[key] !== "")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

const verifyTelegramHash = (
  payload: TelegramAuthPayload,
  botToken: string
) => {
  const dataCheckString = buildDataCheckString(
    normalizeTelegramPayload(payload)
  );
  const secret = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === payload.hash;
};

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!botToken || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase configuration missing" },
      { status: 500 }
    );
  }

  const payload = (await request.json()) as TelegramAuthPayload;

  if (!payload?.id || !payload?.auth_date || !payload?.hash) {
    return NextResponse.json(
      { error: "Invalid Telegram payload" },
      { status: 400 }
    );
  }

  if (!verifyTelegramHash(payload, botToken)) {
    return NextResponse.json(
      { error: "Invalid Telegram signature" },
      { status: 401 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - Number(payload.auth_date) > MAX_AUTH_AGE_SECONDS) {
    return NextResponse.json(
      { error: "Telegram auth payload expired" },
      { status: 401 }
    );
  }

  const cookieStore = cookies();
  const headerList = headers();
  const responseCookies: Array<{
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  }> = [];

  const supabaseServer = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        responseCookies.push(...cookiesToSet);
      },
    },
    headers: {
      get(name) {
        return headerList.get(name);
      },
    },
  });

  const telegramId = String(payload.id);
  const displayName =
    payload.first_name || payload.username || "Пользователь Telegram";
  const username = payload.username ? `@${payload.username}` : null;

  const userMetadata = {
    full_name: displayName,
    name: displayName,
    telegram_id: telegramId,
    telegram_username: username,
    avatar_url: payload.photo_url ?? null,
  };

  const { error: upsertError } = await supabaseAdmin.from("users").upsert(
    {
      telegram_id: telegramId,
      username: payload.username ?? null,
      first_name: payload.first_name ?? null,
      avatar_url: payload.photo_url ?? null,
    },
    { onConflict: "telegram_id" }
  );

  if (upsertError) {
    return NextResponse.json(
      { error: "Failed to sync Telegram profile" },
      { status: 500 }
    );
  }

  const email = `telegram_${telegramId}@telegram.local`;
  const password = crypto
    .createHash("sha256")
    .update(`${telegramId}:${botToken}`)
    .digest("hex");

  let session = null;
  let authUser = null;

  const signInResult = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (signInResult.error) {
    if (signInResult.error.message !== "Invalid login credentials") {
      return NextResponse.json(
        { error: "Supabase sign-in failed" },
        { status: 500 }
      );
    }

    const createResult = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (createResult.error) {
      return NextResponse.json(
        { error: "Failed to create Supabase user" },
        { status: 500 }
      );
    }

    const retrySignIn = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (retrySignIn.error || !retrySignIn.data.session) {
      return NextResponse.json(
        { error: "Supabase sign-in failed" },
        { status: 500 }
      );
    }

    session = retrySignIn.data.session;
    authUser = retrySignIn.data.user;
  } else {
    session = signInResult.data.session;
    authUser = signInResult.data.user;
  }

  if (authUser) {
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      user_metadata: userMetadata,
    });
  }

  if (!session) {
    return NextResponse.json(
      { error: "Supabase session missing" },
      { status: 500 }
    );
  }

  const setSessionResult = await supabaseServer.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  if (setSessionResult.error) {
    return NextResponse.json(
      { error: "Failed to persist Supabase session" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    authenticated: true,
    session,
  });

  responseCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
