"use server";

import { revalidatePath } from "next/cache";

/** Hace que todo el sitio vuelva a leer el contenido recién guardado, sin esperar a que venza la caché. */
export async function revalidarSitio() {
  revalidatePath("/", "layout");
}
