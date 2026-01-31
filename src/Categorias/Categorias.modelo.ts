import { Schema, model, Document } from "mongoose";

export interface ICategoria extends Document {
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategoriaSchema = new Schema<ICategoria>(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: false,
      trim: true
    },
    activo: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

export const CategoriaModel = model<ICategoria>("Categoria", CategoriaSchema);
