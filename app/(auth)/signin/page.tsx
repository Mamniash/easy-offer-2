import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Вход в аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Используй Telegram — без ввода номера телефона в браузере.
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
          После подтверждения в Telegram ты вернёшься обратно на сайт.
        </p>
      </div>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-500">
          Нет аккаунта?{" "}
          <Link
            className="font-medium text-gray-700 underline hover:no-underline"
            href="/signup"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </>
  );
}
