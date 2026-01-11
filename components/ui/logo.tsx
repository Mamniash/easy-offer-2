import Image from "next/image";
import Link from "next/link";

import LogoMark from "@/public/images/logo-01.svg";

type LogoProps = {
  href?: string;
};

export default function Logo({ href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
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
