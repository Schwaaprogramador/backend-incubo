// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN no está definido en las variables de entorno");
}
// Agrega credenciales
export const client = new MercadoPagoConfig({ accessToken });