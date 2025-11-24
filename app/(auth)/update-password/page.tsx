"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !passwordConfirm) {
      setError("Заполни оба поля.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Пароли не совпадают.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Новый пароль</h1>
        <p className="mt-2 text-sm text-gray-500">
          Придумай новый пароль для своего аккаунта.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Новый пароль
          </label>
          <input
            id="password"
            className="form-input w-full py-2"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="passwordConfirm"
          >
            Повтори пароль
          </label>
          <input
            id="passwordConfirm"
            className="form-input w-full py-2"
            type="password"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Пароль обновлён. Сейчас перенаправим на страницу входа…
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-60"
          >
            {loading ? "Обновляем…" : "Обновить пароль"}
          </button>
        </div>
      </form>
    </>
  );
}
