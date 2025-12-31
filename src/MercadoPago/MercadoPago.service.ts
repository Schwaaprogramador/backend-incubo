import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const crearPreferenciaMP = async (producto: {
    id: string;
    title: string;
    price: number;
    quantity: number;
}) => {
    const preference = new Preference(client);

    return await preference.create({
        body: {
            items: [
                {
                    id: producto.id,
                    title: producto.title,
                    unit_price: producto.price,
                    quantity: producto.quantity,
                    currency_id: "COP",
                },
            ],
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pago-exitoso`,
                failure: `${process.env.FRONTEND_URL}/pago-fallido`,
                pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
            },
            auto_return: "approved",
            notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
        },
    });
};
