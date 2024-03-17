<script setup lang="ts">
const pending = ref(false)
const payWithStripe = async () => {
	pending.value = true

	const response = await $fetch<{ url: string }>('/api/create-order', {
		method: 'POST',
		body: {
			product_name: 'Nuxt Course',
			price: 50,
		},
	})

	pending.value = false

	if (response.url) {
		window.location.href = response.url
	} else {
		alert('Something went wrong')
	}
}
</script>

<template>
	<UContainer class="flex flex-col gap-6 items-center py-24">
		<UCard class="max-w-sm w-full">
			<template #header>
				<h1 class="font-bold text-xl text-center">Payments in Nuxt</h1>
			</template>
			<UButton
				@click="payWithStripe"
				:loading="pending"
				block
				size="xl"
				icon="i-mdi-credit-card"
			>
				Pay with Stripe
			</UButton>
		</UCard>
	</UContainer>
</template>
