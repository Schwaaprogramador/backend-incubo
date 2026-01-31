import { Router } from "express";
import { crearPago } from "./MercadoPago.controller.js";

const router = Router();

console.log("✅ MercadoPago routes cargadas");

router.post("/crear-pago", (req, res, next) => {
    console.log("🔵 POST /mercadopago/crear-pago - Request recibido");
    console.log("🔵 Body:", JSON.stringify(req.body, null, 2));
    next();
}, crearPago);

export default router;
