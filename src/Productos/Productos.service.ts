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

  async reducirStock(productoId: string, cantidad: number) {
    return ProductoModel.findByIdAndUpdate(
      productoId,
      { $inc: { stock: -cantidad } },
      { new: true }
    );
  }

  async agregarImagenes(id: string, urls: string[]) {
    return ProductoModel.findByIdAndUpdate(
      id,
      { $push: { imagenes: { $each: urls } } },
      { new: true }
    );
  }

  async eliminarImagenPorIndice(id: string, indice: number): Promise<{ url: string; producto: any } | null> {
    const producto = await ProductoModel.findById(id);
    if (!producto) return null;

    const imagenes = producto.imagenes || [];
    const url = imagenes[indice];
    if (url === undefined) return null;

    imagenes.splice(indice, 1);
    const actualizado = await ProductoModel.findByIdAndUpdate(
      id,
      { imagenes, img: imagenes[0] ?? undefined },
      { new: true }
    );

    return { url, producto: actualizado };
  }

  async prueba() {
    return { mensaje: "Endpoint de prueba funcionando 🚀" };
  }
}
