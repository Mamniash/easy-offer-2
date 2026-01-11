"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, Button, Input } from "antd";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Неверный email или пароль");
      return;
    }

    // Куда вести после входа — настрой сам
    router.push("/");
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Вход в аккаунт</h1>
        <p className="mt-2 text-sm text-gray-500">
          Введи почту и пароль, чтобы продолжить.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
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
              htmlFor="password"
            >
              Пароль
            </label>
            <Input.Password
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <Alert
            className="mt-4"
            type="error"
            showIcon
            message={error}
          />
        )}

        <div className="mt-6">
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? "Входим…" : "Войти"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link
          className="block text-sm text-gray-700 underline hover:no-underline"
          href="/reset-password"
        >
          Забыли пароль?
        </Link>
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
