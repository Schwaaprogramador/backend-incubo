import mongoose, { Schema, model, Document, Model } from "mongoose";

// 1. Interfaz que extiende Document para el tipado de Mongoose
// Primero creamos la interfaz IProducto que extiende Document.
export interface IProducto extends Document {
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
  activo: boolean;

  // Métodos de instancia (declaración)
  aplicarDescuento(porcentaje: number): number;
}

// 2. Clase que implementa la interfaz
export class ProductoClass {
  nombre!: string;
  precio!: number;
  stock!: number;
  descripcion?: string;
  categoria?: string;
  activo!: boolean;

  // ✅ Método de instancia real
  aplicarDescuento(porcentaje: number): number {
    const descuento = this.precio * (porcentaje / 100);
    return this.precio - descuento;
  }

  // ✅ Método estático (no pertenece a la instancia sino al modelo)
  static async contarActivos(this: Model<IProducto>): Promise<number> {
    return this.countDocuments({ activo: true });
  }
}

// 3. Schema usando la clase para métodos
const ProductoSchema = new Schema<IProducto>(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    descripcion: { type: String, required: false },
    categoria: { type: String, required: false },
    activo: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
  }
);

// 4. Asignar métodos de instancia
ProductoSchema.methods = ProductoClass.prototype;

// 5. Asignar métodos estáticos
ProductoSchema.statics.contarActivos = ProductoClass.contarActivos;

// 6. Crear y exportar el modelo
export const ProductoModel = model<IProducto, Model<IProducto>>("Producto", ProductoSchema);

