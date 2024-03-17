export default defineEventHandler(async event => {
	const runtimeConfig = useRuntimeConfig()

	const body = await readRawBody(event)
	if (!body) {
		setResponseStatus(event, 400)
		return { error: 'Missing body' }
	}

	const signature = getHeader(event, 'stripe-signature')
	if (!signature) {
		setResponseStatus(event, 400)
		return { error: 'Missing signature' }
	}

	try {
		const stripeEvent = stripe.webhooks.constructEvent(
			body,
			signature,
			runtimeConfig.stripeWebhookSecret
		)

		if (stripeEvent.type === 'checkout.session.completed') {
			const session = stripeEvent.data.object
			if (
				session.mode === 'payment' &&
				session.payment_status === 'paid'
			) {
				// TODO: handle payment
				console.log('Payment successful', session)
				return { message: 'Payment successful' }
			}
		}

		return { message: 'OK' }
	} catch (error) {
		setResponseStatus(event, 400)
		return { error: 'Invalid signature' }
	}
})
