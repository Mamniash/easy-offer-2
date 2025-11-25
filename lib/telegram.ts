const RATE_LIMIT_TIMEOUT = 60 * 1000; // 60 секунд

type TelegramPayload = {
  subject: string;
  contact: string;
  location: string;
  note?: string;
  sessionTime: number;
};

export const sendToTelegram = async ({
  subject,
  contact,
  location,
  note,
  sessionTime,
}: TelegramPayload) => {
  const botToken = "8161696582:AAHZxsaPggaUncruMMoG1pIjTXleCNAUWTw";
  const chatId = "-1002271508122";
  const threadId = 267; // ID темы "0→1 ответы на лендинг"

  const message = `
🔗 ${subject}
✉️ Контакт: ${contact}
📍 Город/часовой пояс: ${location}
📝 Детали: ${note?.trim() || "не указано"}
⏱ Время на сайте: ${sessionTime} сек.
  `.trim();

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        message_thread_id: threadId,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
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
