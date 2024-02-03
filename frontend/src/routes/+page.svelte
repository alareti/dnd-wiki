<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	let apiUrl = env.PUBLIC_API_URL;
	let session: string | null = null;

	const getSession = () => {
		const token = localStorage.getItem('session');
		if (token) {
			session = token;
		}
	};

	const signOut = async () => {
		localStorage.removeItem('session');
		session = null;
	};

	onMount(() => {
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const token = params.get('token');
		if (token) {
			localStorage.setItem('session', token);
			window.location.replace(window.location.origin);
		}
	});

	onMount(() => {
		getSession();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h2>SST Auth Example</h2>
	{#if session}
		<div>
			<p>Yeah! You are signed in.</p>
			<button on:click={signOut}>Sign out</button>
		</div>
	{:else}
		<div>
			<a href="{apiUrl}/auth/google/authorize" rel="noreferrer">
				<button>Sign in with Google</button>
			</a>
		</div>
	{/if}
</section>
