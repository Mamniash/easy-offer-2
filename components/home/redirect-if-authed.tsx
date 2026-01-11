"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

type RedirectIfAuthedProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function RedirectIfAuthed({
  children,
  redirectTo = "/tracks",
}: RedirectIfAuthedProps) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session?.user) {
        router.replace(redirectTo);
        return;
      }

      setCanRender(true);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace(redirectTo);
        return;
      }

      setCanRender(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [redirectTo, router]);

  if (!canRender) {
    return null;
  }

  return <>{children}</>;
}
