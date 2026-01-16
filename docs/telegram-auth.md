# Telegram redirect-first auth (Supabase)

This project uses a redirect-first Telegram login flow that **does not** rely on
the Telegram Login Widget or any phone-number entry in the browser.

## Flow overview

1. The user clicks **“Войти через Telegram”** and is redirected to the bot:
   `https://t.me/<bot_username>?start=login_<state>`.
2. The bot responds with a button that uses a **login_url** pointing to:
   `https://<your-domain>/api/auth/telegram/callback?state=<state>`.
3. Telegram opens the login URL inside the Telegram app/webview and attaches
   signed user data (id, username, auth_date, hash, etc.).
4. The callback verifies the signature and freshness, then:
   - creates or updates the Supabase auth user,
   - upserts `public.users`,
   - generates a Supabase session and stores it in the browser.

## Bot requirements

Configure your bot to respond to `/start` with `start=login_<state>` by sending
an inline keyboard with a `login_url` button:

- **login_url**: `https://<your-domain>/api/auth/telegram/callback?state=<state>`
- The button must be presented **inside Telegram** (app/desktop/web), so the
  user never enters a phone number in the browser.

## Environment variables

Add the following values to your environment:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

TELEGRAM_BOT_USERNAME=
TELEGRAM_BOT_TOKEN=
TELEGRAM_AUTH_PASSWORD_SECRET=
```

`TELEGRAM_AUTH_PASSWORD_SECRET` is used to derive a deterministic password for
server-side Supabase sign-in (never sent to the client).

## Security notes

- The callback validates `hash` using the Telegram bot token (HMAC-SHA256).
- `auth_date` is required and must be recent (default 5 minutes).
- A short-lived `state` cookie protects against CSRF and replay.

