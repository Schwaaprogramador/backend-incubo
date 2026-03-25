import { Router } from 'express'
import ProductosController from './Productos.controller.ts'
import { uploadProducto, convertToWebp } from '../config/multer.config.js'
import { verificarToken, verificarAdmin } from '../middleware/auth.middleware.js'

const productosRouter: Router = Router();
const productosController = new ProductosController();

productosRouter.get('/', (req, res) => productosController.getProductos(req, res));
productosRouter.get('/prueba', (req, res) => productosController.prueba(req, res));
productosRouter.get('/:id', (req, res) => productosController.getProductoById(req, res));
productosRouter.post('/', verificarToken, verificarAdmin, uploadProducto.single('imagen'), convertToWebp, (req, res) => productosController.crearProducto(req, res));
productosRouter.post('/:id/imagen', verificarToken, verificarAdmin, uploadProducto.single('imagen'), convertToWebp, (req, res) => productosController.subirImagen(req, res));
productosRouter.put('/:id', verificarToken, verificarAdmin, (req, res) => productosController.actualizarProducto(req, res));
productosRouter.delete('/:id', verificarToken, verificarAdmin, (req, res) => productosController.eliminarProducto(req, res));

export default productosRouter;
