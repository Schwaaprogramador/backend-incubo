import { Schema, model, Document, Types } from "mongoose";

export interface ISubcategoria {
  _id?: Types.ObjectId;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface ICategoria extends Document {
  nombre: string;
  descripcion?: string;
  activo: boolean;
  subcategorias: ISubcategoria[];
  createdAt: Date;
  updatedAt: Date;
}

const SubcategoriaSchema = new Schema<ISubcategoria>({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: false, trim: true },
  activo: { type: Boolean, default: true },
});

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
    subcategorias: {
      type: [SubcategoriaSchema],
      default: []
    },
  },
  {
    timestamps: true,
  }
);

export const CategoriaModel = model<ICategoria>("Categoria", CategoriaSchema);
