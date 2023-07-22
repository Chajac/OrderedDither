import { Uniform } from "three";
import { Effect } from "postprocessing";
import bayerdither from "./bayer.glsl";

export interface IDitherProps {
	ditherScale?: number;
	colorThreshold?: number;
	matrixSize?: number;
	dOX?: number;
	dOY?: number;
	xDarkThreshold?: number;
	yWhiteThreshold?: number;
	weight?: number;
	randomize?: boolean;
	seed?: number;
}

// Effect implementation
class DitherEffect extends Effect {
	constructor({
		ditherScale = 1,
		matrixSize = 4,
		colorThreshold = 1024,
		dOX = 0,
		dOY = 0,
		xDarkThreshold = 0,
		yWhiteThreshold = 0,
		randomize = false,
		seed = 0,
	}: IDitherProps = {}) {
		const uniforms = new Map<string, Uniform>([
			["uDitherScale", new Uniform(ditherScale)],
			["uColorThreshold", new Uniform(colorThreshold)],
			["uMatrixSize", new Uniform(matrixSize)],
			["uDitherOffsetX", new Uniform(dOX)],
			["uDitherOffsetY", new Uniform(dOY)],
			["uDarkThreshold", new Uniform(xDarkThreshold)],
			["uWhiteThreshold", new Uniform(yWhiteThreshold)],
			["uRandomize", new Uniform(randomize)],
			["uSeed", new Uniform(seed)],
		]);

		super("BeyerDither", bayerdither, {
			uniforms,
		});
	}
}
