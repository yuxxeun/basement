<script>
	import { supabase } from '~/utils/supabase';
	import moment from 'moment';

	const onInput = (event) => {
		if (event.key !== 'Enter') return;
		inputField.value = '';
	};

	// fetch the data
	async function getData() {
		const { data, error } = await supabase
			.from('comments')
			.select('*')
			.order('id', { ascending: false });
		if (error) throw new Error(error.message);
		return data;
	}

	// insert data
	let newComment = '';
	let inputField;
	let submit = false;

	async function sendData() {
		const { data, error } = await supabase.from('comments').insert([{ txt: newComment }]);
		if (error) throw new Error(error.message);
		return data;
	}
</script>

<section>
	<form on:submit|preventDefault={() => (submit = true)} class="text-white text-center my-5">
		<input
			bind:this={inputField}
			bind:value={newComment}
			on:keydown={onInput}
			required
			minlength="5"
			type="text"
			placeholder="give me some jokes"
			class="input rounded-md p-2 focus:outline-none border border-white bg-black mx-auto input-bordered items-center text-oranged w-full max-w-xs"
		/>
		<button
			value="Submit"
			on:click={() => (submit = false)}
			class="btn m-2 btn-outline btn-secondary font-basement italic">Send</button
		>
	</form>
	{#if submit}
		{#await sendData()}
			<div class="alert alert-info shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="stroke-current flex-shrink-0 w-6 h-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Mengirim pesan...</span>
				</div>
			</div>
		{:then data}
			<div
				class="alert mx-auto md:w-5/6 my-5 items-center text-center font-semibold font-space alert-success shadow-lg"
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Berhasil mengirim pesan, tolong refresh halaman ini untuk melihatnya!</span>
				</div>
			</div>
		{:catch}
			<div
				class="alert mx-auto md:w-5/6 my-5 items-center text-center font-semibold font-space alert-danger shadow-lg"
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Upsss! u can sending messages for now!</span>
				</div>
			</div>
		{/await}
	{/if}

	<!-- show message -->
	<div>
		{#await getData()}
			<div
				class="alert mx-auto md:w-5/6 my-5 items-center text-center font-semibold font-space alert-warning shadow-lg"
			>
				<div>
					<span>Conneting to database...</span>
				</div>
			</div>
		{:then data}
			{#each data as comment}
				<div class="mockup-code card w-96 my-2 mx-auto bg-base-100 shadow-xl">
					<div class="card-body items-center text-center">
						<div class="badge badge-secondary font-space">
							{moment(comment.created_at).format('Do MMMM, YYYY')}
						</div>
						<p class="font-inter text-lg">{comment.txt}</p>
					</div>
				</div>
			{/each}
		{:catch}
			<div
				class="alert mx-auto md:w-5/6 my-5 items-center text-center font-semibold font-space alert-danger shadow-lg"
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span class="italic">Upsss! something happen with my sever</span>
				</div>
			</div>
		{/await}
	</div>
</section>
