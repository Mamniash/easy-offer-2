export default function UpdatePasswordPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Вход через Telegram</h1>
        <p className="mt-2 text-sm text-gray-500">
          Мы полностью перешли на авторизацию через Telegram.
        </p>
      </div>

      <div className="space-y-4">
        <a
          className="btn flex w-full items-center justify-center gap-2 bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] py-2 text-white shadow-sm hover:bg-[length:100%_150%]"
          href="/api/auth/telegram/start"
        >
          <span>Войти через Telegram</span>
        </a>
        <p className="text-sm text-gray-500">
          После подтверждения ты автоматически вернёшься к сайту.
        </p>
      </div>
    </>
  );
}
