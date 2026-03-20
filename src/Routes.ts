import { Router } from "express";
import productosRouter from './Productos/Productos.routes.ts'
import mercadopagoRoutes from './MercadoPago/MercadoPago.routes.js';
import usuariosRouter from './Usuarios/Usuarios.routes.js';
import categoriasRouter from './Categorias/Categorias.routes.js';
import relatosRouter from './Relatos/Relatos.routes.ts';
import pedidosRouter from './Pedidos/Pedidos.routes.js';
import contactoRouter from './Contacto/Contacto.routes.ts';


export class AppRoutes {

    static get routes(): Router {
        const router = Router()
        router.use('/productos', productosRouter)
        router.use('/mercadopago', mercadopagoRoutes);
        router.use('/usuarios', usuariosRouter);
        router.use('/categorias', categoriasRouter);
        router.use('/relatos', relatosRouter);
        router.use('/pedidos', pedidosRouter);
        router.use('/contacto', contactoRouter);
        return router
    }
}