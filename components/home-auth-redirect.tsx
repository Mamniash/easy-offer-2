"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

const REDIRECT_PATH = "/tracks";

export default function HomeAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const redirectIfAuthorized = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted && session?.user) {
        router.replace(REDIRECT_PATH);
      }
    };

    redirectIfAuthorized();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace(REDIRECT_PATH);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
