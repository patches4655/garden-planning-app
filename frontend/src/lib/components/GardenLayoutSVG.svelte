<script lang="ts">
	import type { PlantGroup, Category } from '$lib/types';

	interface Props {
		groups: PlantGroup[];
	}

	let { groups }: Props = $props();

	const CATEGORY_COLORS: Record<Category, string> = {
		fruits: '#e63946',
		veggies: '#2a9d8f',
		herbs: '#8338ec',
		flowers: '#fb8500'
	};

	const CATEGORY_LABELS: Record<Category, string> = {
		fruits: 'Fruits',
		veggies: 'Veggies',
		herbs: 'Herbs',
		flowers: 'Flowers'
	};

	const PX_PER_FT = 60;
	const BED_PAD = 25;
	const BED_GAP = 40;
	const YARD_PAD = 30;
	const LABEL_HEIGHT = 40;

	function bedStyle(type: string): { stroke: string; strokeWidth: number; dash: string; fill: string } {
		const t = type.toLowerCase();
		if (t.includes('yard') || t.includes('grass')) return { stroke: '#66bb6a', strokeWidth: 2, dash: '8 4', fill: '#a5d6a7' };
		if (t.includes('wood')) return { stroke: '#8B6914', strokeWidth: 3, dash: 'none', fill: '#d4a574' };
		if (t.includes('metal')) return { stroke: '#78909c', strokeWidth: 2, dash: '6 3', fill: '#b0bec5' };
		if (t.includes('stone') || t.includes('brick')) return { stroke: '#8d6e63', strokeWidth: 3, dash: 'none', fill: '#bcaaa4' };
		if (t.includes('fabric')) return { stroke: '#66bb6a', strokeWidth: 2, dash: '4 4', fill: '#a5d6a7' };
		if (t.includes('grow bag')) return { stroke: '#4a4a4a', strokeWidth: 2, dash: '3 3', fill: '#9e9e9e' };
		if (t.includes('self-water')) return { stroke: '#1e88e5', strokeWidth: 2, dash: 'none', fill: '#90caf9' };
		if (t.includes('terra cotta')) return { stroke: '#bf360c', strokeWidth: 2, dash: 'none', fill: '#e6a07c' };
		if (t.includes('plastic')) return { stroke: '#7cb342', strokeWidth: 2, dash: 'none', fill: '#c5e1a5' };
		if (t.includes('barrel')) return { stroke: '#5d4037', strokeWidth: 3, dash: 'none', fill: '#a1887f' };
		return { stroke: '#78909c', strokeWidth: 2, dash: '6 3', fill: '#d4a574' };
	}

	function parseSizeFt(size: string): { widthFt: number; heightFt: number } {
		const match = size.match(/(\d+(?:\.\d+)?)\s*(?:ft)?\s*x\s*(\d+(?:\.\d+)?)\s*(?:ft)?/i);
		if (match) {
			return { widthFt: parseFloat(match[1]), heightFt: parseFloat(match[2]) };
		}
		return { widthFt: 3, heightFt: 3 };
	}

	function bedLayout(group: PlantGroup) {
		const { widthFt, heightFt } = parseSizeFt(group.container.size);
		const width = widthFt * PX_PER_FT;
		const height = heightFt * PX_PER_FT;
		const plantCount = group.plants.length;
		const cols = Math.ceil(Math.sqrt(plantCount * (width / height)));
		const rows = Math.ceil(plantCount / cols);
		const cellW = (width - BED_PAD * 2) / cols;
		const cellH = (height - BED_PAD * 2) / rows;
		return { cols, rows, width, height, cellW, cellH };
	}

	function computeBeds(groups: PlantGroup[]) {
		const perRow = groups.length <= 2 ? groups.length : 2;
		const beds = groups.map((g, i) => {
			const layout = bedLayout(g);
			const col = i % perRow;
			const row = Math.floor(i / perRow);
			return { group: g, layout, col, row };
		});

		const colWidths: number[] = [];
		const rowHeights: number[] = [];
		for (const bed of beds) {
			colWidths[bed.col] = Math.max(colWidths[bed.col] || 0, bed.layout.width);
			rowHeights[bed.row] = Math.max(rowHeights[bed.row] || 0, bed.layout.height);
		}

		const positioned = beds.map((bed) => {
			let x = YARD_PAD;
			for (let c = 0; c < bed.col; c++) x += colWidths[c] + BED_GAP;
			x += (colWidths[bed.col] - bed.layout.width) / 2;

			let y = YARD_PAD;
			for (let r = 0; r < bed.row; r++) y += rowHeights[r] + LABEL_HEIGHT + BED_GAP;

			return { ...bed, x, y };
		});

		const totalW =
			colWidths.reduce((a, b) => a + b, 0) + BED_GAP * (colWidths.length - 1) + YARD_PAD * 2;
		const totalH =
			rowHeights.reduce((a, b) => a + b, 0) +
			(LABEL_HEIGHT + BED_GAP) * (rowHeights.length - 1) +
			LABEL_HEIGHT +
			YARD_PAD * 2;

		return { beds: positioned, width: totalW, height: totalH + 50 };
	}

	let layout = $derived(computeBeds(groups));

	function truncate(name: string, max: number): string {
		return name.length > max ? name.slice(0, max - 1) + '\u2026' : name;
	}

	const legendCategories: Category[] = ['fruits', 'veggies', 'herbs', 'flowers'];
</script>

<svg
	viewBox="0 0 {layout.width} {layout.height}"
	class="garden-layout"
	role="img"
	aria-label="Garden layout showing plant beds"
>
	<!-- Yard background -->
	<rect
		x="0"
		y="0"
		width={layout.width}
		height={layout.height}
		rx="12"
		fill="#e8f5e9"
		stroke="#a5d6a7"
		stroke-width="2"
	/>

	{#each layout.beds as bed}
		{@const style = bedStyle(bed.group.container.type)}

		<!-- Bed shape -->
		<rect
			x={bed.x}
			y={bed.y}
			width={bed.layout.width}
			height={bed.layout.height}
			rx="6"
			fill={style.fill}
			fill-opacity="0.35"
			stroke={style.stroke}
			stroke-width={style.strokeWidth}
			stroke-dasharray={style.dash}
		/>

		<!-- Plants inside bed -->
		{#each bed.group.plants as plant, pi}
			{@const col = pi % bed.layout.cols}
			{@const row = Math.floor(pi / bed.layout.cols)}
			{@const cx = bed.x + BED_PAD + col * bed.layout.cellW + bed.layout.cellW / 2}
			{@const cy = bed.y + BED_PAD + row * bed.layout.cellH + bed.layout.cellH / 2}

			<g>
				<title>{plant.name} ({plant.category})</title>
				<circle
					{cx}
					{cy}
					r="20"
					fill={CATEGORY_COLORS[plant.category]}
					fill-opacity="0.9"
					stroke="white"
					stroke-width="2"
				/>
				<text
					x={cx}
					y={cy + 4}
					text-anchor="middle"
					fill="white"
					font-size="8"
					font-weight="600"
				>
					{truncate(plant.name, 9)}
				</text>
				<text
					x={cx}
					y={cy + 36}
					text-anchor="middle"
					fill="#333"
					font-size="9"
				>
					{plant.name}
				</text>
			</g>
		{/each}

		<!-- Bed label -->
		<text
			x={bed.x + bed.layout.width / 2}
			y={bed.y + bed.layout.height + 16}
			text-anchor="middle"
			font-size="12"
			font-weight="600"
			fill="#333"
		>
			{bed.group.name}
		</text>
		<text
			x={bed.x + bed.layout.width / 2}
			y={bed.y + bed.layout.height + 30}
			text-anchor="middle"
			font-size="10"
			fill="#666"
		>
			{bed.group.container.type} &mdash; {bed.group.container.size}
		</text>
	{/each}

	<!-- Legend -->
	{#each legendCategories as cat, i}
		<circle
			cx={layout.width - 140 + i * 34}
			cy={layout.height - 40}
			r="6"
			fill={CATEGORY_COLORS[cat]}
		/>
		<text
			x={layout.width - 140 + i * 34}
			y={layout.height - 40 + 14}
			text-anchor="middle"
			font-size="7"
			fill="#555"
		>
			{CATEGORY_LABELS[cat]}
		</text>
	{/each}
</svg>

<style>
	.garden-layout {
		width: 100%;
		height: auto;
		max-height: 550px;
		border-radius: 12px;
	}
</style>
