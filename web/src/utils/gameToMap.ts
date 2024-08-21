const mapCenter: [number, number] = [-119.43, 58.84];
const latPr100 = 1.421;

export function gameToMap(x: number, y: number): [number, number] {
	return [
		mapCenter[0] + (latPr100 / 100) * y,
		mapCenter[1] + (latPr100 / 100) * x,
	];
}