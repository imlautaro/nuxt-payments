import crypto from 'crypto'
import { Payment } from 'mercadopago'

export default defineEventHandler(async event => {
	const runtimeConfig = useRuntimeConfig()

	const body = await readBody(event)
	if (!body) {
		setResponseStatus(event, 400)
		return { error: 'Missing body' }
	}

	const signature = getHeader(event, 'x-signature')
	if (!signature) {
		setResponseStatus(event, 400)
		return { error: 'Missing signature' }
	}

	const requestId = getHeader(event, 'x-request-id')
	if (!requestId) {
		setResponseStatus(event, 400)
		return { error: 'Missing request id' }
	}

	const ts = signature.split(',')[0].split('=')[1]
	const v1 = signature.split(',')[1].split('=')[1]

	const template = `id:${body.data.id};request-id:${requestId};ts:${ts};`

	const cyphedSignature = crypto
		.createHmac('sha256', runtimeConfig.mercadopagoWebhookSecret)
		.update(template)
		.digest('hex')

	if (cyphedSignature !== v1) {
		setResponseStatus(event, 400)
		return { error: 'Invalid signature' }
	}

	// valid signature
	const payment = new Payment(mercadopago)

	const { status } = await payment.get({
		id: body.data.id,
	})

	if (status === 'approved') {
		// TODO: handle payment
		console.log('Payment successfull')
	}

	setResponseStatus(event, 201)
	return true
})
