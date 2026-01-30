const RATE_LIMIT_TIMEOUT = 60 * 1000; // 60 секунд

type TelegramPayload = {
  subject: string;
  contact: string;
  location: string;
  note?: string;
  sessionTime: number;
};

type SubscriptionPayload = {
  planName: string;
  planPrice: string;
  promoCode?: string;
  user: {
    telegramId?: number | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
};

const TELEGRAM_BOT_TOKEN = "8161696582:AAHZxsaPggaUncruMMoG1pIjTXleCNAUWTw";
const TELEGRAM_CHAT_ID = "-1002271508122";
const TELEGRAM_THREAD_ID = 267; // ID темы "0→1 ответы на лендинг"

export const sendToTelegram = async ({
  subject,
  contact,
  location,
  note,
  sessionTime,
}: TelegramPayload) => {
  const message = `
🔗 ${subject}
✉️ Контакт: ${contact}
📍 Город/часовой пояс: ${location}
📝 Детали: ${note?.trim() || "не указано"}
⏱ Время на сайте: ${sessionTime} сек.
  `.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        message_thread_id: TELEGRAM_THREAD_ID,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
    return false;
  }
};

export const sendSubscriptionToTelegram = async ({
  planName,
  planPrice,
  promoCode,
  user,
}: SubscriptionPayload) => {
  const username = user.username ? `@${user.username}` : null;
  const contactLabel = username ?? "не указан";
  const telegramLink = username ?? "не указан";
  const message = `
💳 Запрос на оплату подписки
🗂 Тариф: ${planName} (${planPrice})
🏷 Промокод: ${promoCode?.trim() || "не указан"}
👤 Пользователь: ${contactLabel}
🔗 Telegram: ${telegramLink}
  `.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        message_thread_id: TELEGRAM_THREAD_ID,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Ошибка при отправке подписки в Telegram:", error);
    return false;
  }
};

export const canSendMessage = () => {
  const now = Date.now();

  if (typeof window === "undefined") {
    return false;
  }

  const lastSent = window.localStorage.getItem("lastSent");

  if (lastSent && now - Number(lastSent) < RATE_LIMIT_TIMEOUT) {
    return false;
  }

  window.localStorage.setItem("lastSent", now.toString());
  return true;
};

export type { TelegramPayload };
