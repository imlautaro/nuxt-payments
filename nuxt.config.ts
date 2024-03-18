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
		public: {
			baseURL: '',
			paypalClientId: '',
		},
	},
})
