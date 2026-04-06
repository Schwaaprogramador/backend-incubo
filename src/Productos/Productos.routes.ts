import { Router } from 'express'
import ProductosController from './Productos.controller.ts'
import { uploadProducto, convertToWebpArray } from '../config/multer.config.js'
import { verificarToken, verificarAdmin } from '../middleware/auth.middleware.js'

const productosRouter: Router = Router();
const productosController = new ProductosController();

productosRouter.get('/', (req, res) => productosController.getProductos(req, res));
productosRouter.get('/prueba', (req, res) => productosController.prueba(req, res));
productosRouter.get('/:id', (req, res) => productosController.getProductoById(req, res));
productosRouter.post('/', verificarToken, verificarAdmin, uploadProducto.array('imagenes', 10), convertToWebpArray, (req, res) => productosController.crearProducto(req, res));
productosRouter.post('/:id/imagenes', verificarToken, verificarAdmin, uploadProducto.array('imagenes', 10), convertToWebpArray, (req, res) => productosController.agregarImagenes(req, res));
productosRouter.delete('/:id/imagenes/:indice', verificarToken, verificarAdmin, (req, res) => productosController.eliminarImagen(req, res));
productosRouter.put('/:id', verificarToken, verificarAdmin, (req, res) => productosController.actualizarProducto(req, res));
productosRouter.delete('/:id', verificarToken, verificarAdmin, (req, res) => productosController.eliminarProducto(req, res));

export default productosRouter;
