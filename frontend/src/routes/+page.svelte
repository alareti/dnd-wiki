<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	let apiUrl = env.PUBLIC_API_URL;
	let session: any = null;

	const getUserInfo = async (session: any) => {
		try {
			const response = await fetch(`${apiUrl}/session`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${session}`
				}
			});
			return response.json();
		} catch (error) {
			console.log("Here's the error");
		}
	};

	const getSession = async () => {
		const token = localStorage.getItem('session');
		if (token) {
			const user = await getUserInfo(token);
			if (user) session = user;
		}
		loading = false;
	};

	const signOut = async () => {
		localStorage.removeItem('session');
		session = null;
	};

	let loading = true;
	onMount(async () => {
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const token = params.get('token');
		if (token) {
			localStorage.setItem('session', token);
			window.location.replace(window.location.origin);
		}
		getSession();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h2>SST Auth Example</h2>
	{#if loading}
		<div></div>
	{:else if session}
		<div>
			<div class="profile">
				<p>Welcome {session.name}!</p>
				<img src={session.picture} width={100} height={100} alt="" />
				<p>{session.email}</p>
				<button on:click={signOut}>Sign out</button>
			</div>
		</div>
	{:else}
		<div>
			<a href="{apiUrl}/auth/google/authorize" rel="noreferrer">
				<button>Sign in with Google</button>
			</a>
		</div>
	{/if}
</section>
