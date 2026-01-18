import "antd/dist/reset.css";
import "./css/style.css";
import { Suspense } from "react";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";

import { PostHogProvider } from "./providers";
import { AuthModalProvider } from "@/components/ui/auth-modal-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata = {
  title: "PreOffer",
  description:
    "Подготовка к собеседованиям с реальными вопросами и прогрессом.",
  icons: {
    icon: "/images/logo-01.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#2563eb",
              colorInfo: "#2563eb",
              borderRadius: 12,
              fontFamily: inter.style.fontFamily,
            },
          }}
        >
          <PostHogProvider>
            <Suspense>
              <AuthModalProvider>
                <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
                  {children}
                </div>
              </AuthModalProvider>
            </Suspense>
          </PostHogProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
