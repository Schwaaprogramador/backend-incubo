import { CategoriaModel } from "./Categorias.modelo.js";
import type { ICategoria } from "./Categorias.modelo.js";

export class CategoriasService {
  async obtenerTodas() {
    return CategoriaModel.find().sort({ nombre: 1 });
  }

  async obtenerActivas() {
    return CategoriaModel.find({ activo: true }).sort({ nombre: 1 });
  }

  async obtenerPorId(id: string) {
    return CategoriaModel.findById(id);
  }

  async obtenerPorNombre(nombre: string) {
    return CategoriaModel.findOne({ nombre: new RegExp(`^${nombre}$`, 'i') });
  }

  async crear(data: Partial<ICategoria>) {
    const categoria = new CategoriaModel(data);
    return categoria.save();
  }

  async actualizar(id: string, data: Partial<ICategoria>) {
    return CategoriaModel.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id: string) {
    return CategoriaModel.findByIdAndDelete(id);
  }
}
