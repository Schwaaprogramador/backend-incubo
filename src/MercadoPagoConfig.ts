// SDK de Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';

import dotenv from 'dotenv';
// Esta línea lee el archivo .env y carga las variables en process.env
dotenv.config(); 

const accessToken = process.env.MP_ACCESS_TOKEN;

console.log(accessToken)
if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN no está definido en las variables de entorno");
}
// Agrega credenciales
export const client = new MercadoPagoConfig({ accessToken });