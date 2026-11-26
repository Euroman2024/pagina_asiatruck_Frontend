export type Rol = "ADMIN" | "CLIENTE";

export interface SessionUser {
  id: string;
  email: string;
  nombre?: string | null;
  rol: Rol;
}

/** Usuario tal como lo ve el administrador en el panel (GET /usuarios) */
export interface UsuarioAdmin {
  id: string;
  email: string;
  nombre: string | null;
  telefono: string | null;
  comentario: string | null;
  rol: Rol;
  emailVerificado: boolean;
  creadoEn: string;
}
