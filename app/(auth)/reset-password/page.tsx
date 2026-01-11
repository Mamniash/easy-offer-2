"use client";

import { FormEvent, useState } from "react";
import { Alert, Button, Input } from "antd";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const redirectTo = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Если такой аккаунт существует, мы отправили письмо с ссылкой для смены пароля."
    );
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Восстановление пароля</h1>
        <p className="mt-2 text-sm text-gray-500">
          Введи email, и мы отправим ссылку для смены пароля.
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
        </div>

        {error && (
          <Alert className="mt-4" type="error" showIcon message={error} />
        )}

        {message && (
          <Alert className="mt-4" type="info" showIcon message={message} />
        )}

        <div className="mt-6">
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? "Отправляем письмо…" : "Отправить письмо"}
          </Button>
        </div>
      </form>
    </>
  );
}
