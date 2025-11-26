import { ProductoModel } from "./Productos.modelo.ts";

export class ProductosService {
  async obtenerTodos() {
    return ProductoModel.find();
  }

  async obtenerPorId(id: string) {
    return ProductoModel.findById(id);
  }

  async crear(data: any) {
    const producto = new ProductoModel(data);
    return producto.save();
  }

  async actualizar(id: string, data: any) {
    return ProductoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id: string) {
    return ProductoModel.findByIdAndDelete(id);
  }

  async prueba() {
    return { mensaje: "Endpoint de prueba funcionando 🚀" };
  }
}
