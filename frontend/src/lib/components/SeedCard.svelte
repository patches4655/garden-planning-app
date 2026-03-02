<script lang="ts">
	import type { Category } from '$lib/types';

	interface Props {
		name: string;
		category: Category;
		selected: boolean;
		onclick: () => void;
	}

	let { name, category, selected, onclick }: Props = $props();

	const categoryColors: Record<Category, string> = {
		fruits: 'var(--color-fruits)',
		veggies: 'var(--color-veggies)',
		herbs: 'var(--color-herbs)',
		flowers: 'var(--color-flowers)'
	};
</script>

<button
	class="seed-card"
	class:selected
	style="--category-color: {categoryColors[category]}"
	onclick={onclick}
>
	<span class="seed-name">{name}</span>
</button>

<style>
	.seed-card {
		padding: 0.75rem 1rem;
		border: 2px solid var(--category-color);
		border-radius: 8px;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.seed-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.seed-card.selected {
		background: var(--category-color);
		color: white;
	}

	.seed-name {
		font-size: 0.9rem;
		text-transform: capitalize;
	}
</style>
