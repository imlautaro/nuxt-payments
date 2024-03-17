import { Stripe } from 'stripe'

const runtimeConfig = useRuntimeConfig()

export const stripe = new Stripe(runtimeConfig.stripeSecretKey)
