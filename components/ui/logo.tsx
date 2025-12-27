\"use client\";

import { useEffect, useState } from \"react\";
import Image from \"next/image\";
import Link from \"next/link\";

import { supabase } from \"@/lib/supabaseClient\";

import LogoMark from "@/public/images/logo-01.svg";

export default function Logo() {
  const [linkTarget, setLinkTarget] = useState(\"/\");

  useEffect(() => {
    let isMounted = true;

    const updateTarget = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setLinkTarget(session?.user ? \"/tracks\" : \"/\");
      }
    };

    updateTarget();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLinkTarget(session?.user ? \"/tracks\" : \"/\");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Link
      href={linkTarget}
      className="inline-flex items-center gap-2"
      aria-label="PreOffer"
    >
      <Image
        src={LogoMark}
        alt="Логотип PreOffer"
        className="h-7 w-auto"
        priority
      />
      <span className="text-lg font-semibold text-gray-900">PreOffer</span>
    </Link>
  );
}
