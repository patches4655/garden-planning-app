import { writable } from 'svelte/store';
import type { GardenPreferences } from '$lib/types';

export const gardenPreferences = writable<GardenPreferences>({
	yard_width: 10,
	yard_depth: 10,
	sun_exposure: 'full sun',
	bed_types: ['Wood Raised Bed', 'Metal Raised Bed']
});
