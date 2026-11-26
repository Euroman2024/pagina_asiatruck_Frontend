import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccesoRequerido } from "@/components/auth/AccesoRequerido";
import { getContenido } from "@/lib/contenido";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asiatruk | Repuestos para camiones",
  description:
    "Catálogo de repuestos para camiones de marcas chinas en Ecuador.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { contacto } = await getContenido();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col">
          <AccesoRequerido>{children}</AccesoRequerido>
        </div>
        <Footer contacto={contacto} />
      </body>
    </html>
  );
}
