import { Router } from "express";
// import webRouter from './WebRoutes'
import productosRouter from './Productos/Productos.routes.ts'

export class AppRoutes {

    static get routes(): Router {
        const router = Router()
        router.use('/productos', productosRouter)
        return router
    }
}