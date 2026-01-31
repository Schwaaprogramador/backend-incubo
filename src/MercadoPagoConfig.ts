import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN;

console.log("🟡 MercadoPago Config - Token presente:", !!accessToken);
console.log("🟡 MercadoPago Config - Token preview:", accessToken ? accessToken.substring(0, 20) + "..." : "NO TOKEN");

if (!accessToken) {
    throw new Error("MP_ACCESS_TOKEN no está definido en las variables de entorno");
}

export const client = new MercadoPagoConfig({
    accessToken
});

console.log("✅ MercadoPago Client inicializado");
