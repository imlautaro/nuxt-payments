export default defineNuxtConfig({
	colorMode: {
		preference: 'light',
	},
	modules: ['@nuxt/ui'],
	runtimeConfig: {
		stripeSecretKey: '',
		stripeWebhookSecret: '',
		paypalClientSecret: '',
		paypalWebhookId: '',
		mercadopagoWebhookSecret: '',
		mercadopagoAccessToken: '',
		public: {
			baseURL: '',
			paypalClientId: '',
			mercadopagoKey: '',
		},
	},
})
