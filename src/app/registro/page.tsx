import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Crear cuenta | Asiatruk" };

export default function RegistroPage() {
  return <AuthPage inicial="registro" />;
}
