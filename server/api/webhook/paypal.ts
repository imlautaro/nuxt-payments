export default defineEventHandler(async event => {
	const runtimeConfig = useRuntimeConfig()
	const paypal = await createPayPalClient()

	const body = await readBody(event)
	if (!body) {
		setResponseStatus(event, 400)
		return { error: 'Missing body' }
	}

	const headers = Object.fromEntries(
		[
			'auth-algo',
			'cert-url',
			'transmission-id',
			'transmission-sig',
			'transmission-time',
		].map(header => [
			header.replace('-', '_'),
			getHeader(event, `paypal-${header}`),
		])
	)

	try {
		const { verification_status } = await paypal.fetch<{
			verification_status: string
		}>('/v1/notifications/verify-webhook-signature', {
			method: 'POST',
			body: {
				...headers,
				webhook_id: runtimeConfig.paypalWebhookId,
				webhook_event: body,
			},
		})

		if (verification_status !== 'SUCCESS') {
			setResponseStatus(event, 400)
			return { error: 'Invalid signature' }
		}

		if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
			// TODO: handle payment
			console.log('Payment successfull')
		}

		return true
	} catch (error) {
		console.error(error)
		setResponseStatus(event, 400)
		return { error: 'Invalid signature' }
	}
})
