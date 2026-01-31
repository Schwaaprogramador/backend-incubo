import { Router } from 'express'
import ProductosController from './Productos.controller.ts'
import { uploadProducto } from '../config/multer.config.js'

const productosRouter: Router = Router();
const productosController = new ProductosController();

productosRouter.get('/', (req, res) => productosController.getProductos(req, res));
productosRouter.get('/prueba', (req, res) => productosController.prueba(req, res));
productosRouter.get('/:id', (req, res) => productosController.getProductoById(req, res));
productosRouter.post('/', uploadProducto.single('imagen'), (req, res) => productosController.crearProducto(req, res));
productosRouter.post('/:id/imagen', uploadProducto.single('imagen'), (req, res) => productosController.subirImagen(req, res));
productosRouter.put('/:id', (req, res) => productosController.actualizarProducto(req, res));
productosRouter.delete('/:id', (req, res) => productosController.eliminarProducto(req, res));

export default productosRouter;
