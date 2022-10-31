<script>
	import { fly } from 'svelte/transition'
	import { supabase } from '~/utils/supabase'
	import { SITE } from '~/config.mjs'

	async function getData() {
		const { data, error } = await supabase.from('books').select('*').order('time', { ascending: false })
		if (error) throw new Error(error.message)
		return data
	}
	const promise = getData()
	const meta = {
		title: `Bookmark — ${SITE.name}`,
		description: SITE.description,
		ogType: 'Bookmark',
	}
</script>

<section class="mx-auto font-delight tracking-wide my-10">
	<div class="text-center">
		<span
			class="font-display lg:text-6xl px-auto text-2xl text-center uppercase tracking-tight dark:text-orange-600 text-orange-600"
			>Bookmark
		</span>
	</div>
	<div class="max-w-6xl mx-auto text-left sm:px-6">
		{#await promise}
			<div class="my-3">
				<img src="/loading.svg" class="animate-spin mx-auto my-10" alt="Reactivity...." width="200" />
			</div>
		{:then data}
			{#each data as book}
				<ul class="my-5 py-5" transition:fly={{ y: 150, duration: 1500 }}>
					<li class="__inter">
						<div class="px-4 sm:px-6">
							<h3 class="text-lg font-display leading-6 text-black dark:text-white">
								<a href={book.link} target="blank" class="hover:text-gray-500">
									{book.title} by {book.author}
								</a>
							</h3>
							<p class="mt-1 max-w-2xl font-delight truncate text-sm">
								<a href={book.link} target="blank" class="text-orange-600 hover:text-gray-500">
									{book.link}
								</a>
							</p>
							<p class="mt-3 max-w-2xl font-space text-sm text-gray-500">
								{book.time}
							</p>
						</div>
					</li>
				</ul>
			{/each}
		{:catch error}
			<div class="my-10">
				<img src="/loading.svg" class="animate-spin mx-auto my-10" alt="Reactivity..." width="200" />
				<p class="text-orange-500 text-center font-delight text-xl">
					Oppsss something bad happen with my <del>Firebase</del> Supabase database.
				</p>
			</div>
		{/await}
	</div>
</section>
