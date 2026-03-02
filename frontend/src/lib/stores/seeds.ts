import { writable } from 'svelte/store';
import type { SeedsByCategory } from '$lib/types';

export const seeds = writable<SeedsByCategory | null>(null);
export const seedsLoading = writable(false);
export const seedsError = writable<string | null>(null);
