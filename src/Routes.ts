import { Router } from "express";
import productosRouter from './Productos/Productos.routes.ts'
import mercadopagoRoutes from './MercadoPago/MercadoPago.routes.js';
import usuariosRouter from './Usuarios/Usuarios.routes.js';


export class AppRoutes {

    static get routes(): Router {
        const router = Router()
        router.use('/productos', productosRouter)
        router.use('/mercadopago', mercadopagoRoutes);
        router.use('/usuarios', usuariosRouter);
        return router
    }
}