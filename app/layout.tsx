import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ThemePanel from "@/components/public/ThemePanel";

export const metadata: Metadata = {
  title: "Blattkids — Muebles Montessori",
  description: "Muebles Montessori de madera natural para niños de 0 a 10 años. Diseñados con medidas certificadas para favorecer la independencia y el desarrollo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full">
        <Providers>{children}</Providers>
        <ThemePanel />
      </body>
    </html>
  );
}
