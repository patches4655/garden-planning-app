<script lang="ts">
	import { onMount } from 'svelte';
	import type { Category, SeedsByCategory } from '$lib/types';
	import { fetchSeeds } from '$lib/api/client';
	import { seeds, seedsLoading, seedsError } from '$lib/stores/seeds';
	import { selectedSeeds, selectedCount, toggleSeed } from '$lib/stores/selectedSeeds';
	import SeedCard from './SeedCard.svelte';
	import GardenPreferences from './GardenPreferences.svelte';

	interface Props {
		onGenerate: () => void;
	}

	let { onGenerate }: Props = $props();

	const categories: { key: Category; label: string }[] = [
		{ key: 'fruits', label: 'Fruits' },
		{ key: 'veggies', label: 'Veggies' },
		{ key: 'herbs', label: 'Herbs' },
		{ key: 'flowers', label: 'Flowers' }
	];

	onMount(async () => {
		if ($seeds) return;

		seedsLoading.set(true);
		seedsError.set(null);

		try {
			const data = await fetchSeeds();
			seeds.set(data);
		} catch (e) {
			seedsError.set(e instanceof Error ? e.message : 'Failed to load seeds');
		} finally {
			seedsLoading.set(false);
		}
	});
</script>

<div class="seed-selector">
	{#if $seedsLoading}
		<div class="loading">Loading seeds...</div>
	{:else if $seedsError}
		<div class="error">{$seedsError}</div>
	{:else if $seeds}
		<GardenPreferences />

		{#each categories as { key, label }}
			<section class="category-section" data-category={key}>
				<h2>{label}</h2>
				<div class="seed-grid">
					{#each $seeds[key] as seedName}
						<SeedCard
							name={seedName}
							category={key}
							selected={$selectedSeeds.has(seedName)}
							onclick={() => toggleSeed(seedName)}
						/>
					{/each}
				</div>
			</section>
		{/each}

		<div class="actions">
			<span class="count">{$selectedCount} seeds selected</span>
			<button class="generate-btn" disabled={$selectedCount === 0} onclick={onGenerate}>
				Generate Garden Plan
			</button>
		</div>
	{/if}
</div>

<style>
	.seed-selector {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.category-section h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: var(--color-text);
		border-bottom: 2px solid var(--color-border);
		padding-bottom: 0.5rem;
	}

	.seed-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--color-bg-alt);
		border-radius: 8px;
		position: sticky;
		bottom: 1rem;
	}

	.count {
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.generate-btn {
		padding: 0.75rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.generate-btn:hover:not(:disabled) {
		background: var(--color-primary-dark);
	}

	.generate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
	}

	.error {
		color: var(--color-error);
	}
</style>
