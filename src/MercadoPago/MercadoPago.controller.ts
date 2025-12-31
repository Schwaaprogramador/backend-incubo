import type { Request, Response } from "express";
import { crearPreferenciaMP } from "./MercadoPago.service.ts";

export const crearPago = async (req: Request, res: Response) => {
    try {
        const { id, title, price, quantity } = req.body;

        const preference = await crearPreferenciaMP({
            id,
            title,
            price,
            quantity,
        });

        res.json({
            id: preference.id,
            init_point: preference.init_point,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando pago" });
    }
};

export const webhookMP = (req: Request, res: Response) => {
    console.log("Webhook MercadoPago:", req.body);

    // Aquí luego validas el pago con la API
    res.sendStatus(200);
};
