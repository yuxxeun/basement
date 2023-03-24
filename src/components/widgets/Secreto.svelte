<script>
	import { fly } from 'svelte/transition'
	import { supabase } from '~/utils/supabase'
	import { SITE } from '~/config.mjs'
	import moment from 'moment';

	async function getData() {
		const { data, error } = await supabase.from('comments').select('*').order('id', { ascending: false })
		if (error) throw new Error(error.message)
		return data
	}
	const promise = getData()
	const meta = {
		title: `Secreto — ${SITE.name}`,
		description: SITE.description,
		ogType: 'Secreto',
	}
</script>

<section class="mx-auto font-delight tracking-wide my-10">
	<div class="text-center">
		<span class="font-display lg:text-6xl px-auto text-2xl text-center uppercase tracking-tight text-oranged">
			{meta.ogType}
		</span>
		<p class="my-5 italic text-xl">
			*input comment currently disabled.
		</p>
		<div class="space-x-3">
			<input type="text" class="cursor-not-allowed text-white px-4 py-2 rounded-lg bg-black border border-white" placeholder="give me dad jokes" disabled />
			<button class="bg-black border text-white border-white px-3 py-2 rounded-lg cursor-not-allowed">Send!</button>
		</div>
	</div>
	<div class="max-w-6xl items-center justify-center align-middle mx-auto sm:px-6">
		{#await promise}
			<div class="my-3">
				<img src="/loading.svg" class="animate-spin grayscale mx-auto my-10" alt="Reactivity...." width="200" />
			</div>
		{:then data}
			{#each data as comment}
				<ul class="my-5 py-5 px-3 border md:w-3/6 w-3/4 rounded-lg mx-auto text-center justify-center items-center align-middle border-white" transition:fly={{ y: 150, duration: 1500 }}>
					<li class="mx-auto">
						<div class="px-4 text-center justify-center items-center sm:px-6">
							<h3 class="text-md mb-3 lg:text-2xl font-delight leading-6text-black dark:text-white">
									{comment.txt}
							</h3>
							<span class="px-2 lg:max-w-3xl max-w-xs font-delight text-md w-fit text-white dark:text-oranged bg-oranged/30 dark:bg-oranged/20 border border-oranged rounded-lg">
								{ moment(comment.created_at).format('D MMM, YYYY') }
							</span>
						</div>
					</li>
				</ul>
			{/each}
		{:catch error}
			<div class="my-10">
				<img src="/loading.svg" class="animate-spin mx-auto my-10" alt="Reactivity..." width="200" />
				<p class="text-oranged text-center font-delight text-xl">
					{error}
				</p>
			</div>
		{/await}
	</div>
</section>
