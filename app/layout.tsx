/* eslint-disable @next/next/no-head-element */
"use client";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import Gallery from "@/components/Gallery";
import "./globals.css"

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <html>
      <head></head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Gallery />
        </QueryClientProvider>
      </body>
    </html>
  );
}
