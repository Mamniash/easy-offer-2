import crypto from "crypto";

const TELEGRAM_AUTH_WINDOW_SECONDS = 300;

type TelegramAuthPayload = {
  auth_date: string;
  hash: string;
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

const buildDataCheckString = (payload: TelegramAuthPayload) => {
  const entries = Object.entries(payload)
    .filter(([key, value]) => key !== "hash" && value !== undefined)
    .map(([key, value]) => [key, String(value)] as const)
    .sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([key, value]) => `${key}=${value}`).join("\n");
};

export const verifyTelegramAuthPayload = (
  payload: TelegramAuthPayload,
  botToken: string,
) => {
  const dataCheckString = buildDataCheckString(payload);
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hash === payload.hash;
};

export const isTelegramAuthFresh = (authDate: string) => {
  const authTimestamp = Number(authDate);

  if (!Number.isFinite(authTimestamp)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return Math.abs(nowSeconds - authTimestamp) <= TELEGRAM_AUTH_WINDOW_SECONDS;
};

export type { TelegramAuthPayload };
