export default defineEventHandler(async event => {
	const runtimeConfig = useRuntimeConfig()
	const body = await readBody(event)

	switch (body.payment_method) {
		case 'stripe':
			try {
				const session = await stripe.checkout.sessions.create({
					success_url: `${runtimeConfig.public.baseURL}/thank-you`,
					line_items: [
						{
							price_data: {
								currency: 'usd',
								product_data: {
									name: body.product_name,
								},
								unit_amount: body.price * 100,
							},
							quantity: 1,
						},
					],
					mode: 'payment',
				})

				return { url: session.url }
			} catch (error) {
				setResponseStatus(event, 500)
				return { error: 'Something went wrong' }
			}
		case 'paypal':
			const paypal = await createPayPalClient()

			const order = await paypal.fetch('/v2/checkout/orders', {
				method: 'POST',
				body: {
					intent: 'CAPTURE',
					purchase_units: [
						{
							amount: {
								currency_code: 'USD',
								value: String(body.price),
							},
						},
					],
					payment_source: {
						paypal: {
							experience_context: {
								brand_name: 'Michi Programador',
								shipping_preference: 'NO_SHIPPING',
								return_url: `${runtimeConfig.public.baseURL}/thank-you`,
							},
						},
					},
				},
			})

			return { url: order.links[1].href }
		default:
			setResponseStatus(event, 400)
			return { error: 'Invalid payment platform' }
	}
})
