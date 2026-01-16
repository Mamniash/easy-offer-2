export default function SignUp() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Создать аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Регистрация выполняется через Telegram.
        </p>
      </div>

      <div className="space-y-4">
        <a
          className="btn flex w-full items-center justify-center gap-2 bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] py-2 text-white shadow-sm hover:bg-[length:100%_150%]"
          href="/api/auth/telegram/start"
        >
          <span>Продолжить через Telegram</span>
        </a>
        <p className="text-sm text-gray-500">
          Подтверди вход в Telegram, и мы автоматически создадим аккаунт.
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Уже есть аккаунт?{" "}
          <a
            className="font-medium text-gray-700 underline hover:no-underline"
            href="/signin"
          >
            Войти
          </a>
        </p>
      </div>
    </>
  );
}
