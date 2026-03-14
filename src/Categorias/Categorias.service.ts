import { CategoriaModel } from "./Categorias.modelo.js";
import type { ICategoria, ISubcategoria } from "./Categorias.modelo.js";

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

  async agregarSubcategoria(categoriaId: string, data: Partial<ISubcategoria>) {
    return CategoriaModel.findByIdAndUpdate(
      categoriaId,
      { $push: { subcategorias: data } },
      { new: true }
    );
  }

  async actualizarSubcategoria(categoriaId: string, subId: string, data: Partial<ISubcategoria>) {
    return CategoriaModel.findByIdAndUpdate(
      categoriaId,
      {
        $set: {
          "subcategorias.$[sub].nombre": data.nombre,
          ...(data.descripcion !== undefined && { "subcategorias.$[sub].descripcion": data.descripcion }),
          ...(data.activo !== undefined && { "subcategorias.$[sub].activo": data.activo }),
        }
      },
      {
        arrayFilters: [{ "sub._id": subId }],
        new: true
      }
    );
  }

  async eliminarSubcategoria(categoriaId: string, subId: string) {
    return CategoriaModel.findByIdAndUpdate(
      categoriaId,
      { $pull: { subcategorias: { _id: subId } } },
      { new: true }
    );
  }
}
