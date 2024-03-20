import { MercadoPagoConfig } from 'mercadopago'

const runtimeConfig = useRuntimeConfig()

export const mercadopago = new MercadoPagoConfig({
	accessToken: runtimeConfig.mercadopagoAccessToken,
})
