import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Viaje Chile 2026",
  description: "App de viaje a Santiago de Chile - Enero 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Viaje Chile",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        <StoreProvider>
          <main className="min-h-[100dvh]" style={{ paddingBottom: 'calc(3.5rem + env(safe-area-inset-bottom))' }}>{children}</main>
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
