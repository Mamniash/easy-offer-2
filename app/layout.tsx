import "./css/style.css";

export const metadata = {
  title: "PreOffer",
  description: "Подготовка к собеседованиям с реальными вопросами и прогрессом.",
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
      <body className="bg-gray-50 font-inter tracking-tight text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
