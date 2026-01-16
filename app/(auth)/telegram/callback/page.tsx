import { Suspense } from "react";

import TelegramCallbackClient from "./telegram-callback-client";

function CallbackFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        <p className="text-sm text-gray-500">
          Подключаем Telegram и создаем сессию…
        </p>
      </div>
    </div>
  );
}

export default function TelegramCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <TelegramCallbackClient />
    </Suspense>
  );
}
