export interface Marca {
  id: string;
  nombre: string;
}

export interface Modelo {
  id: string;
  nombre: string;
  marcaId: string;
  marca?: Marca;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string | null;
  imagen?: string | null;
}

export interface Compatibilidad {
  id: string;
  repuestoId: string;
  modeloId: string;
  modelo: Modelo;
}

export interface Repuesto {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  stock: number;
  imagenes: string[];
  categoriaId: string;
  categoria?: Categoria;
  /** Marcas asignadas directamente al repuesto */
  marcas?: Marca[];
  compatibilidad?: Compatibilidad[];
  creadoEn: string;
  actualizadoEn: string;
}
