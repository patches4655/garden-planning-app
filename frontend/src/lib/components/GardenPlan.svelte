<script lang="ts">
	import type { GardenPlan } from '$lib/types';
	import PlantGroup from './PlantGroup.svelte';
	import GardenLayoutSVG from './GardenLayoutSVG.svelte';

	interface Props {
		plan: GardenPlan;
		onSave: () => void;
		onStartOver: () => void;
	}

	let { plan, onSave, onStartOver }: Props = $props();
</script>

<div class="garden-plan">
	<section class="garden-visual">
		<h2>Your Garden Layout</h2>
		<GardenLayoutSVG groups={plan.plant_groups} />
	</section>

	<section class="plant-groups">
		<h2>Bed Details</h2>
		<div class="groups-grid">
			{#each plan.plant_groups as group}
				<PlantGroup {group} />
			{/each}
		</div>
	</section>

	{#if plan.aesthetic_tips.length > 0}
		<section class="tips">
			<h2>Aesthetic Tips</h2>
			<ul>
				{#each plan.aesthetic_tips as tip}
					<li>{tip}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="bloom-schedule">
		<h2>Bloom Schedule</h2>
		<div class="seasons">
			{#if plan.bloom_schedule.spring.length > 0}
				<div class="season">
					<h3>Spring</h3>
					<div class="bloom-plants">
						{#each plan.bloom_schedule.spring as plant}
							<span class="bloom-tag">{plant}</span>
						{/each}
					</div>
				</div>
			{/if}
			{#if plan.bloom_schedule.summer.length > 0}
				<div class="season">
					<h3>Summer</h3>
					<div class="bloom-plants">
						{#each plan.bloom_schedule.summer as plant}
							<span class="bloom-tag">{plant}</span>
						{/each}
					</div>
				</div>
			{/if}
			{#if plan.bloom_schedule.fall.length > 0}
				<div class="season">
					<h3>Fall</h3>
					<div class="bloom-plants">
						{#each plan.bloom_schedule.fall as plant}
							<span class="bloom-tag">{plant}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>

	<div class="actions">
		<button class="btn-secondary" onclick={onStartOver}>Start Over</button>
		<button class="btn-primary" onclick={onSave}>Save Garden Plan</button>
	</div>
</div>

<style>
	.garden-plan {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.garden-visual {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	section h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: var(--color-text);
		border-bottom: 2px solid var(--color-border);
		padding-bottom: 0.5rem;
	}

	.groups-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.tips ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tips li {
		padding: 0.75rem 1rem;
		background: var(--color-bg-alt);
		border-radius: 8px;
		margin-bottom: 0.5rem;
		border-left: 4px solid var(--color-primary);
	}

	.seasons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.season {
		background: var(--color-bg-alt);
		padding: 1rem;
		border-radius: 8px;
	}

	.season h3 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		color: var(--color-primary);
	}

	.bloom-plants {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.bloom-tag {
		background: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		text-transform: capitalize;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		background: var(--color-primary-dark);
	}

	.btn-secondary {
		background: white;
		color: var(--color-text);
		border: 2px solid var(--color-border);
	}

	.btn-secondary:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>
