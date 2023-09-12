<script>
	import { fly } from 'svelte/transition'
	import { supabase } from '~/utils/supabase'
	import { SITE } from '~/config.mjs'
	import moment from 'moment';

	const meta = {
		title: `Secreto`,
		description: SITE.description,
		ogType: 'Secreto',
	}

	const onInput = (event) => {
		if (event.key == 'Enter');
	};

	async function getData() {
		const { data, error } = await supabase.from('comments').select('*').order('id', { ascending: false })
		if (error) throw new Error(error.message)
		return data
	}
	
	const promise = getData()

	let newComment = '';
	let submit = false;

	async function sendData() {
		const { data, error } = await supabase.from('comments').insert([{ txt: newComment }]);
		if (error) throw new Error(error.message);
		return data;
	}
</script>

<section class="mx-auto font-delight tracking-wide my-10">
	<div class="text-center">
		<span class="font-display lg:text-6xl px-auto text-2xl text-center uppercase tracking-tight text-oranged"
			>{meta.title}
		</span>
	</div>

	<!-- form submit messages -->
	<form on:submit|preventDefault={() => (submit = true)} class="space-x-3 text-white text-center my-5">
		<input
			bind:value={newComment}
			on:keypress={onInput}
			required
			minlength="5"
			type="text"
			placeholder="lorem ipsum"
			class="text-black dark:text-white focus:outline-none px-4 py-2 rounded-lg bg-white dark:bg-black border-2 border-oranged dark:border-oranged"
		/>
		<button
			value="Submit"
			on:click={() => (submit = false)}
			class="dark:bg-oranged/20 dark:border-oranged bg-oranged/30 text-oranged border border-oranged dark:text-oranged px-3 py-2 rounded-lg">
			Send!
		</button>
	</form>
	{#if submit}
		{#await sendData()}
			<div class="text-oranged text-center font-delight">
				<div>
					<span>Mengirim pesan...</span>
				</div>
			</div>
		{:then data}
			<div
				class="text-center text-oranged before:md:w-5/6 my-5">
				<div>
					<span>
						Berhasil mengirim pesan.
						<br>
						Refresh halaman ini untuk melihatnya!</span>
				</div>
			</div>
		{:catch}
			<div
				class="text-oranged font-delight md:w-5/6 my-5">
				<div>
					<span>
						Upsss! u can sending messages for now!
					</span>
				</div>
			</div>
		{/await}
	{/if}
	<!-- end -->

	<div class="max-w-6xl mx-auto text-left sm:px-6">
		{#await promise}
			<div class="my-3">
				<img src="/loading.svg" class="animate-spin grayscale mx-auto my-10" alt="Reactivity...." width="200" />
			</div>
		{:then data}
			{#each data as comment}
				<ul class="my-5 py-5" transition:fly={{ y: 200, duration: 6000 }}>
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

