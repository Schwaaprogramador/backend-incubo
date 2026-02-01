import { Schema, model, Document, Model } from "mongoose";

export interface IRelato extends Document {
  titulo: string;
  autor: string;
  tags?: string;
  contenido: string;
  aprobado: boolean;
  activo: boolean;
}

const RelatoSchema = new Schema<IRelato>(
  {
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    tags: { type: String, required: false },
    contenido: { type: String, required: true },
    aprobado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const RelatoModel = model<IRelato, Model<IRelato>>("Relato", RelatoSchema);
