import { writable, derived } from 'svelte/store';

export const selectedSeeds = writable<Set<string>>(new Set());

export const selectedCount = derived(selectedSeeds, ($seeds) => $seeds.size);

export const selectedList = derived(selectedSeeds, ($seeds) => Array.from($seeds));

export function toggleSeed(name: string) {
	selectedSeeds.update((set) => {
		const newSet = new Set(set);
		if (newSet.has(name)) {
			newSet.delete(name);
		} else {
			newSet.add(name);
		}
		return newSet;
	});
}

export function clearSelection() {
	selectedSeeds.set(new Set());
}
