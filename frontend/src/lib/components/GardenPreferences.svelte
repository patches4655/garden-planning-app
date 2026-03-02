<script lang="ts">
	import { gardenPreferences } from '$lib/stores/gardenPreferences';

	const BED_OPTIONS = [
		{ value: 'Wood Raised Bed', label: 'Wood Raised Bed' },
		{ value: 'Metal Raised Bed', label: 'Metal Raised Bed' }
	];

	const SUN_OPTIONS = ['full sun', 'partial sun', 'partial shade'];

	function toggleBedType(bedType: string) {
		gardenPreferences.update((prefs) => {
			const types = prefs.bed_types.includes(bedType)
				? prefs.bed_types.filter((t) => t !== bedType)
				: [...prefs.bed_types, bedType];
			return { ...prefs, bed_types: types.length > 0 ? types : prefs.bed_types };
		});
	}
</script>

<div class="preferences">
	<h2>Garden Setup</h2>
	<div class="fields">
		<div class="field-group">
			<label>
				Yard Width (ft)
				<input
					type="number"
					min="4"
					max="100"
					bind:value={$gardenPreferences.yard_width}
				/>
			</label>
			<label>
				Yard Depth (ft)
				<input
					type="number"
					min="4"
					max="100"
					bind:value={$gardenPreferences.yard_depth}
				/>
			</label>
			<label>
				Sun Exposure
				<select bind:value={$gardenPreferences.sun_exposure}>
					{#each SUN_OPTIONS as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
		</div>

		<fieldset class="bed-types">
			<legend>Bed Types</legend>
			<div class="checkbox-group">
				{#each BED_OPTIONS as { value, label }}
					<label class="checkbox-label">
						<input
							type="checkbox"
							checked={$gardenPreferences.bed_types.includes(value)}
							onchange={() => toggleBedType(value)}
						/>
						{label}
					</label>
				{/each}
			</div>
		</fieldset>
	</div>
</div>

<style>
	.preferences {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	h2 {
		font-size: 1.25rem;
		margin: 0 0 1rem;
		color: var(--color-text);
		border-bottom: 2px solid var(--color-border);
		padding-bottom: 0.5rem;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-group {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.field-group label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	input[type='number'],
	select {
		padding: 0.5rem;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		font-size: 0.9rem;
		font-family: inherit;
		width: 120px;
	}

	select {
		width: 160px;
	}

	input[type='number']:focus,
	select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.bed-types {
		border: none;
		padding: 0;
		margin: 0;
	}

	.bed-types legend {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.checkbox-group {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		accent-color: var(--color-primary);
		width: 18px;
		height: 18px;
	}
</style>
