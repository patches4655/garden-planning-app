/**
 * Stardew Valley-inspired pixel art icons for garden plants.
 * Each icon is an 8x8 grid. Characters map to colors, '.' is transparent.
 */

export const GRID_SIZE = 8;

export interface Pixel {
	x: number;
	y: number;
	color: string;
}

const C: Record<string, string> = {
	r: '#e74c3c',
	R: '#c0392b',
	g: '#7bc67e',
	G: '#3d8b40',
	l: '#b5e8b5',
	o: '#f39c12',
	O: '#e67e22',
	y: '#f1c40f',
	Y: '#d4ac0d',
	p: '#9b59b6',
	P: '#d7bde2',
	w: '#ecf0f1',
	W: '#ffffff',
	b: '#8b7355',
	B: '#5d4e37',
	k: '#2c3e50',
	m: '#e91e63',
	M: '#f8bbd0',
	t: '#1abc9c'
};

const ICONS: Record<string, string[]> = {
	tomato: [
		'....g...',
		'...gG...',
		'..rrrr..',
		'.rrrrrr.',
		'.rRrrrr.',
		'.rrrrrr.',
		'..rrrr..',
		'........'
	],
	watermelon: [
		'..gggg..',
		'.gGggGg.',
		'gGggggGg',
		'gggggggg',
		'gGgggGgg',
		'.gGggGg.',
		'..gggg..',
		'........'
	],
	pepper: [
		'...GG...',
		'..Gggg..',
		'..gggg..',
		'.gglggg.',
		'.gglggg.',
		'.gggggg.',
		'..gggg..',
		'........'
	],
	pepper_hot: [
		'....GG..',
		'...Gg...',
		'...gg...',
		'..gggg..',
		'..gggg..',
		'.gggg...',
		'.ggg....',
		'........'
	],
	carrot: [
		'..gGgG..',
		'...gG...',
		'...oo...',
		'..oooo..',
		'..oOoo..',
		'...ooo..',
		'....oo..',
		'.....o..'
	],
	legume: [
		'........',
		'......g.',
		'..gggG..',
		'.glllGg.',
		'.glllGg.',
		'..gggG..',
		'.g......',
		'........'
	],
	cucumber: [
		'........',
		'.....Gg.',
		'...gggg.',
		'..gglgg.',
		'.ggllg..',
		'.gglg...',
		'..gG....',
		'........'
	],
	okra: [
		'...G....',
		'...gg...',
		'..gggg..',
		'..glgg..',
		'..glgg..',
		'..gggg..',
		'...gg...',
		'...b....'
	],
	fennel: [
		'.g.g.g..',
		'..ggg...',
		'..gGg...',
		'...g....',
		'..lll...',
		'.lGlGl..',
		'..lll...',
		'........'
	],
	herb: [
		'........',
		'..g.g...',
		'.gGgGg..',
		'..gGg...',
		'...g....',
		'...b....',
		'...b....',
		'........'
	],
	herb_purple: [
		'........',
		'..p.p...',
		'.pPpPp..',
		'..pPp...',
		'...p....',
		'...b....',
		'...b....',
		'........'
	],
	lavender: [
		'.p...p..',
		'.pP.pP..',
		'.pP.pP..',
		'..p..p..',
		'..g..g..',
		'...gg...',
		'...b....',
		'...b....'
	],
	flower_orange: [
		'........',
		'..ooo...',
		'.ooyoo..',
		'.oyYyo..',
		'.ooyoo..',
		'..ooo...',
		'...b....',
		'...b....'
	],
	flower_pink: [
		'........',
		'..mmm...',
		'.mMwMm..',
		'.mwWwm..',
		'.mMwMm..',
		'..mmm...',
		'...b....',
		'...b....'
	],
	flower_white: [
		'........',
		'..www...',
		'.wwyWw..',
		'.wyYyw..',
		'.wwYww..',
		'..www...',
		'...b....',
		'...b....'
	],
	morning_glory: [
		'........',
		'..ppp...',
		'.pPPPp..',
		'pPPwPp..',
		'.pPPp...',
		'..ggg...',
		'...gG...',
		'........'
	],
	linaria: [
		'...m....',
		'..mMm...',
		'...m....',
		'...g....',
		'..mMm...',
		'...m....',
		'...g....',
		'...b....'
	]
};

function parseIcon(rows: string[]): Pixel[] {
	const pixels: Pixel[] = [];
	for (let y = 0; y < rows.length; y++) {
		for (let x = 0; x < rows[y].length; x++) {
			const ch = rows[y][x];
			if (ch !== '.' && C[ch]) {
				pixels.push({ x, y, color: C[ch] });
			}
		}
	}
	return pixels;
}

// Pre-parse all icons
const PARSED: Record<string, Pixel[]> = {};
for (const [key, rows] of Object.entries(ICONS)) {
	PARSED[key] = parseIcon(rows);
}

function getIconKey(plantName: string): string {
	const n = plantName.toLowerCase();
	if (n.includes('tomato')) return 'tomato';
	if (n.includes('watermelon')) return 'watermelon';
	if (n.includes('jalapeno') || n.includes('jalapeño')) return 'pepper_hot';
	if (n.includes('pepper')) return 'pepper';
	if (n.includes('carrot')) return 'carrot';
	if (n.includes('cucumber')) return 'cucumber';
	if (n.includes('okra')) return 'okra';
	if (n.includes('fennel')) return 'fennel';
	if (n.includes('cowpea') || n.includes('bean') || n.includes('pea') || n.includes('snap'))
		return 'legume';
	if (n.includes('lavender')) return 'lavender';
	if (n.includes('basil')) return 'herb_purple';
	if (
		n.includes('bergamot') ||
		n.includes('dill') ||
		n.includes('oregano') ||
		n.includes('mint') ||
		n.includes('rosemary') ||
		n.includes('sage') ||
		n.includes('thyme')
	)
		return 'herb';
	if (n.includes('marigold') || n.includes('zinnia') || n.includes('zinna'))
		return 'flower_orange';
	if (n.includes('cosmos')) return 'flower_pink';
	if (n.includes('daisy')) return 'flower_white';
	if (n.includes('morning glory')) return 'morning_glory';
	if (n.includes('linaria')) return 'linaria';
	return 'herb';
}

export function getPlantPixels(plantName: string): Pixel[] {
	const key = getIconKey(plantName);
	return PARSED[key] || PARSED['herb'];
}
