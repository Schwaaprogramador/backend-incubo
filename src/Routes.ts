import { Router } from "express";
// import webRouter from './WebRoutes'
import productosRouter from './Productos/Productos.routes.ts'
import mercadopagoRoutes from './MercadoPago/MercadoPago.routes.ts';


export class AppRoutes {

    static get routes(): Router {
        const router = Router()
        router.use('/productos', productosRouter)
        router.use('/mercadopago', mercadopagoRoutes);
        return router
    }
}