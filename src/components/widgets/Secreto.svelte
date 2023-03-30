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
		<span class="font-display lg:text-6xl px-auto text-2xl text-center uppercase tracking-tight text-oranged"
			>{meta.ogType}
		</span>
		<p class="my-5 text-xl">
			*currently unavailable for public.
		</p>
		<div class="space-x-3">
			<input type="text" class="cursor-not-allowed text-white px-4 py-2 rounded-lg bg-white dark:bg-black border border-oranged dark:border-white" placeholder="hey!" disabled />
			<button class="dark:bg-black bg-oranged/30 text-oranged border border-oranged dark:text-white dark:border-white px-3 py-2 rounded-lg cursor-not-allowed">Send!</button>
		</div>
	</div>
	<div class="max-w-6xl mx-auto text-left sm:px-6">
		{#await promise}
			<div class="my-3">
				<img src="/loading.svg" class="animate-spin grayscale mx-auto my-10" alt="Reactivity...." width="200" />
			</div>
		{:then data}
			{#each data as comment}
				<ul class="my-5 py-5" transition:fly={{ y: 150, duration: 1500 }}>
					<li class="__inter">
						<div class="px-4 sm:px-6">
							<h3 class="text-lg lg:text-2xl font-display leading-6 text-black dark:text-white">
								{comment.txt}
							</h3>
							<p class="my-3 px-2 lg:max-w-3xl max-w-xs truncate font-delight text-md w-fit text-oranged  dark:text-oranged bg-oranged/30 dark:bg-oranged/20 border border-oranged rounded-lg">
								{ moment(comment.created_at).format('D MMM, YYYY') }
							</p>
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

