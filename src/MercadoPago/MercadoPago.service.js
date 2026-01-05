import { Preference } from "mercadopago";
import { client } from "../MercadoPagoConfig.ts";

const preference = new Preference(client);

const createPreference = async (preferenceData) => {

    try {
        preference.create({ preferenceData })
    } catch (error) {

    }
}

export default createPreference
