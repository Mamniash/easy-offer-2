import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  isTelegramAuthFresh,
  TelegramAuthPayload,
  verifyTelegramAuthPayload,
} from "@/lib/telegram-auth";

const buildStorageKey = (supabaseUrl: string) => {
  const hostname = new URL(supabaseUrl).hostname;
  const projectRef = hostname.split(".")[0];
  return `sb-${projectRef}-auth-token`;
};

const isSafeReturnTo = (returnTo: string | null) => {
  if (!returnTo) {
    return false;
  }

  return returnTo.startsWith("/") && !returnTo.startsWith("//");
};

const hashTelegramPassword = (secret: string, telegramId: string) =>
  crypto.createHmac("sha256", secret).update(telegramId).digest("hex");

const renderHtml = (options: {
  script: string;
  message: string;
  description?: string;
}) => `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Telegram Login</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        background: radial-gradient(circle at top, #eef5ff, #f7f9fc 45%, #ffffff);
        color: #0f172a;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
      .card {
        width: min(520px, 100%);
        background: #ffffff;
        border-radius: 24px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
        padding: 32px;
        text-align: center;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #1d4ed8;
        background: #eff6ff;
      }
      .title {
        margin: 16px 0 8px;
        font-size: 24px;
        font-weight: 700;
      }
      .description {
        margin: 0;
        font-size: 14px;
        color: #64748b;
        line-height: 1.5;
      }
      .spinner {
        margin: 24px auto 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 4px solid #dbeafe;
        border-top-color: #2563eb;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">Telegram</div>
      <h1 class="title">${options.message}</h1>
      <p class="description">
        ${options.description ?? "Скоро вернём вас на сайт, это займёт пару секунд."}
      </p>
      <div class="spinner" aria-hidden="true"></div>
    </div>
    <script>
      ${options.script}
    </script>
  </body>
</html>
`;

export const GET = async (request: NextRequest) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const passwordSecret = process.env.TELEGRAM_AUTH_PASSWORD_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!botToken || !passwordSecret || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing auth configuration" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get("tg_auth_state")?.value;
  const returnToCookie = cookieStore.get("tg_auth_return_to")?.value ?? "/";
  const returnTo = isSafeReturnTo(returnToCookie) ? returnToCookie : "/";

  cookieStore.delete("tg_auth_state");
  cookieStore.delete("tg_auth_return_to");

  const searchParams = request.nextUrl.searchParams;
  const payload: TelegramAuthPayload = {
    id: searchParams.get("id") ?? "",
    first_name: searchParams.get("first_name") ?? undefined,
    last_name: searchParams.get("last_name") ?? undefined,
    username: searchParams.get("username") ?? undefined,
    photo_url: searchParams.get("photo_url") ?? undefined,
    auth_date: searchParams.get("auth_date") ?? "",
    hash: searchParams.get("hash") ?? "",
  };
  const state = searchParams.get("state");

  if (!state || !stateCookie || state !== stateCookie) {
    return new NextResponse(
      renderHtml({
        message: "Невалидная сессия авторизации. Попробуйте войти ещё раз.",
        description: "Если редирект не произойдёт автоматически, вернитесь на сайт.",
        script: "setTimeout(() => window.location.replace('/?login=1'), 1500);",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const telegramId = Number(payload.id);
  if (
    !payload.id ||
    !payload.hash ||
    !Number.isFinite(telegramId) ||
    !isTelegramAuthFresh(payload.auth_date)
  ) {
    return new NextResponse(
      renderHtml({
        message: "Ссылка для входа устарела. Попробуйте снова.",
        description: "Мы откроем форму авторизации на главной странице.",
        script: "setTimeout(() => window.location.replace('/?login=1'), 1500);",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  if (!verifyTelegramAuthPayload(payload, botToken)) {
    return new NextResponse(
      renderHtml({
        message: "Не удалось подтвердить данные Telegram.",
        description: "Откроем форму входа, чтобы вы могли попробовать ещё раз.",
        script: "setTimeout(() => window.location.replace('/?login=1'), 1500);",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const email = `telegram-${payload.id}@telegram.local`;
  const password = hashTelegramPassword(passwordSecret, payload.id);
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const createResponse = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      telegram_id: telegramId,
      username: payload.username ?? null,
      first_name: payload.first_name ?? null,
      last_name: payload.last_name ?? null,
      avatar_url: payload.photo_url ?? null,
    },
  });

  const createError = createResponse.error;
  const isAlreadyExists =
    createError?.code === "email_exists" ||
    createError?.message.toLowerCase().includes("already");

  if (createError && !isAlreadyExists) {
    return NextResponse.json(
      { error: createError.message },
      { status: 500 },
    );
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signInData.session || !signInData.user) {
    return NextResponse.json(
      { error: signInError?.message ?? "Failed to sign in" },
      { status: 500 },
    );
  }

  const existingUser = await supabaseAdmin
    .from("users")
    .select("id, telegram_id")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (existingUser.error) {
    return NextResponse.json(
      { error: existingUser.error.message },
      { status: 500 },
    );
  }

  if (existingUser.data && existingUser.data.id !== signInData.user.id) {
    return NextResponse.json(
      { error: "Telegram account already linked to another user." },
      { status: 409 },
    );
  }

  const upsertResponse = await supabaseAdmin.from("users").upsert(
    {
      id: signInData.user.id,
      telegram_id: telegramId,
      username: payload.username ?? null,
      first_name: payload.first_name ?? null,
      avatar_url: payload.photo_url ?? null,
    },
    { onConflict: "id" },
  );

  if (upsertResponse.error) {
    return NextResponse.json(
      { error: upsertResponse.error.message },
      { status: 500 },
    );
  }

  const updateResponse = await supabaseAdmin.auth.admin.updateUserById(
    signInData.user.id,
    {
      user_metadata: {
        telegram_id: telegramId,
        username: payload.username ?? null,
        first_name: payload.first_name ?? null,
        last_name: payload.last_name ?? null,
        avatar_url: payload.photo_url ?? null,
      },
    },
  );

  if (updateResponse.error) {
    return NextResponse.json(
      { error: updateResponse.error.message },
      { status: 500 },
    );
  }

  const storageKey = buildStorageKey(supabaseUrl);
  const session = signInData.session;
  const sessionPayload = {
    ...session,
    user: signInData.user,
  };

  return new NextResponse(
    renderHtml({
      message: "Выполняем вход…",
      description: "Сохраняем сессию и возвращаем на ту страницу, где вы были.",
      script: `
        const session = ${JSON.stringify(sessionPayload)};
        window.localStorage.setItem(
          ${JSON.stringify(storageKey)},
          JSON.stringify(session)
        );
        window.location.replace(${JSON.stringify(returnTo)});
      `,
    }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
};
