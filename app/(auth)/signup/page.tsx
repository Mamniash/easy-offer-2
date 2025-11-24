"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);

    // Можно сразу вести на страницу логина через пару секунд
    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Создать аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Зарегистрируйся, чтобы получить доступ к платформе.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Полное имя
            </label>
            <input
              id="name"
              className="form-input w-full py-2"
              type="text"
              placeholder="Иван Иванов"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="form-input w-full py-2"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="phone"
            >
              Телефон
            </label>
            <input
              id="phone"
              className="form-input w-full py-2"
              type="text"
              placeholder="+7 900 000-00-00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Пароль
            </label>
            <input
              id="password"
              className="form-input w-full py-2"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Аккаунт создан. Проверь почту и подтверди email.
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-60"
          >
            {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </button>
        </div>
      </form>

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
