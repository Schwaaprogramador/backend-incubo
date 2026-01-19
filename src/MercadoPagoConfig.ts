import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN no está definido en las variables de entorno");
}

export const client = new MercadoPagoConfig({
    accessToken
});
