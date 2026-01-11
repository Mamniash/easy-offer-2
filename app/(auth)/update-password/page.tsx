"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Input } from "antd";
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
          <Input.Password
            id="password"
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
          <Input.Password
            id="passwordConfirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        {error && <Alert type="error" showIcon message={error} />}

        {success && (
          <Alert
            type="success"
            showIcon
            message="Пароль обновлён. Сейчас перенаправим на страницу входа…"
          />
        )}

        <div className="mt-6">
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? "Обновляем…" : "Обновить пароль"}
          </Button>
        </div>
      </form>
    </>
  );
}
