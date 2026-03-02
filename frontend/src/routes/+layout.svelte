<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Garden Companion Planner</title>
</svelte:head>

<div class="app">
	<header>
		<h1>Garden Companion Planner</h1>
		<p>Select your seeds and get AI-powered planting recommendations</p>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>Built with Svelte + FastAPI + Claude</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background: var(--color-primary);
		color: white;
		padding: 2rem;
		text-align: center;
	}

	header h1 {
		margin: 0 0 0.5rem;
		font-size: 2rem;
	}

	header p {
		margin: 0;
		opacity: 0.9;
	}

	main {
		flex: 1;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem;
	}

	footer {
		background: var(--color-bg-alt);
		padding: 1rem;
		text-align: center;
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}

	footer p {
		margin: 0;
	}
</style>
