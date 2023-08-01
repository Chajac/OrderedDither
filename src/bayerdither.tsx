import { Uniform } from "three";
import { Effect } from "postprocessing";
import bayerdither from "./bayer.glsl";

export interface IDitherProps {
	ditherScale?: number;
	colorThreshold?: number;
	matrixSize?: number;
	dOffsetX?: number;
	dOffsetY?: number;
	xDarkThreshold?: number;
	yWhiteThreshold?: number;
	randomize?: boolean;
	seed?: number;
	useColor?: boolean;
}

// Effect implementation
export class DitherEffect extends Effect {
	constructor({
		ditherScale = 1,
		matrixSize = 4,
		colorThreshold = 1024,
		dOffsetX = 0,
		dOffsetY = 0,
		xDarkThreshold = 0,
		yWhiteThreshold = 0,
		randomize = false,
		seed = 0,
		useColor = false,
	}: IDitherProps = {}) {
		const uniforms = new Map<string, Uniform>([
			["uDitherScale", new Uniform(ditherScale)],
			["uColorThreshold", new Uniform(colorThreshold)],
			["uMatrixSize", new Uniform(matrixSize)],
			["uDitherOffsetX", new Uniform(dOffsetX)],
			["uDitherOffsetY", new Uniform(dOffsetY)],
			["uDarkThreshold", new Uniform(xDarkThreshold)],
			["uWhiteThreshold", new Uniform(yWhiteThreshold)],
			["uRandomize", new Uniform(randomize)],
			["uSeed", new Uniform(seed)],
			["uUseColor", new Uniform(useColor)],
		]);

		super("BeyerDither", bayerdither, {
			uniforms,
		});
	}
}
