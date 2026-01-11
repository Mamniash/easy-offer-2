"use client";

import type { ReactNode } from "react";
import { ConfigProvider } from "antd";

const theme = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#2563eb",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
    colorError: "#dc2626",
    colorTextBase: "#111827",
    colorBgLayout: "#f8fafc",
    borderRadius: 12,
    fontFamily: "var(--font-inter), Inter, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 999,
      paddingInline: 20,
    },
    Input: {
      borderRadius: 12,
    },
    Modal: {
      borderRadiusLG: 20,
    },
  },
};

export default function Providers({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
