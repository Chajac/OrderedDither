import { useMemo } from "react";
import "./App.css";
import { Canvas, Vector3 } from "@react-three/fiber";
import Text from "./Text";
import { EffectComposer } from "@react-three/postprocessing";
import { OrderedDither } from "../ordered dither/OrderedDither";
import {
	MeshTransmissionMaterial,
	Environment,
	MarchingCubes,
} from "@react-three/drei";
import { useControls, folder } from "leva";
import { Pointer, MetaBall } from "./Metaball";
import { Physics } from "@react-three/rapier";

const [width, height]: number[] = [1920, 1080];
function App() {
	const Config = useControls({
		InitialValues: folder({
			textNum: { value: 5, step: 1 },
			metaBallsNum: { value: 15, max: 15, step: 1 },
			colValue: { value: 507, step: 1 },
		}),
		DitherSettings: folder({
			matrixSize: {
				value: "4",
				options: {
					"2x2": "2",
					"3x3": "3",
					"4x4": "4",
					"8x8": "8",

					vertical: "20",
					horizontal: "21",
				},
			},
			"8x8 Values": folder({
				eightNum: {
					render: (get) => get("DitherSettings.matrixSize") == 8,
					value: 8,
					step: 1,
				},
				eightNumAug: {
					render: (get) => get("DitherSettings.matrixSize") == 8,
					value: 1,
					step: 1,
				},
			}),

			useColor: true,
			invertDither: false,
			colorThreshold: { value: 1024, min: 1, max: 1024, step: 1 },
			ditherScale: { value: 2, min: 0, max: 10, step: 0.1 },
			darkThreshold: { value: -2, step: 0.01 },
			lightThreshold: { value: 0, step: 0.01 },
			dOffsetX: { value: 0, min: 0, max: 10, step: 0.1 },
			dOffsetY: { value: 0, min: 0, max: 10, step: 0.1 },
			Randomization: folder({
				randomize: false,
				seed: { value: 0, step: 1 },
			}),
		}),
		MaterialSettings: folder({
			meshPhysicalMaterial: false,
			transmissionSampler: true,
			backside: false,
			backsideThickness: { value: 0, min: 0, max: 10, step: 0.001 },

			transmission: { value: 1.12, step: 0.01 },
			roughness: { value: 0.48, min: 0, max: 1, step: 0.001 },
			thickness: { value: 0.18, min: 0, max: 3, step: 0.001 },
			ior: { value: 0.9, min: 0, max: 4.1, step: 0.001 },
			chromaticAberration: { value: 2.39, min: 0, max: 10, step: 0.001 },
			anisotropy: { value: 4.68, min: 0, max: 10, step: 0.001 },
			anisotropicBlur: { value: 5.42, min: 0, max: 10, step: 0.001 },
			distortion: { value: 0.77, min: 0, max: 10, step: 0.001 },
			distortionScale: { value: 4.02, min: 0, max: 50, step: 0.01 },
			temporalDistortion: { value: 0.36, min: 0, max: 10, step: 0.001 },
			iridescence: { value: 3.25, min: 0, max: 5, step: 0.001 },
			iridescenceIOR: { value: 1.36, min: 0, max: 5, step: 0.001 },
			iridescenceThicknessRange: {
				min: 0,
				max: 2000,
				value: [0, 1400],
			},
			envMapIntensity: { value: 0.5, min: 0, max: 2, step: 0.001 },
			// clearcoat: { value: 0.0, min: 0, max: 10, step: 0.001 },
			// attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.001 },
			// attenuationColor: "#dd1bc3",
			// color: "#da3402",
			// bg: "#bf5fe6",
		}),
	});

	const MetaballInstances = useMemo<JSX.Element[]>(() => {
		const colors = ["#dd1bc3", "#a8b319", "#dd821b", "#ff5332", "#07f1ca"];

		return Array.from({ length: Config.metaBallsNum }, (_, i) => (
			<MetaBall
				key={i}
				color={colors[Math.floor(Math.random() * colors.length)]}
				position={[1, 2, 0.5]}
			/>
		));
	}, [Config.metaBallsNum]);

	const TextInstances: JSX.Element[] = Array.from(
		{ length: Config.textNum },
		(_, i) => {
			const position: Vector3 = [-0.9, (1.6 - i) * 0.35, -1.71];
			const saturation = (i / (Config.textNum - 1)) * 100;
			const hue = (312.941176 - i) * Config.colValue;
			return (
				<>
					<Text
						key={i}
						position={position}
						height={i * 0.85}
						color={`hsl(${hue}, ${saturation}%, 50%)`}
					/>
				</>
			);
		}
	);

	return (
		<div className="App" style={{ width: width, height: height }}>
			<Canvas
				shadows
				camera={{
					position: [-0.55, 0, 20],
					fov: 5,
					near: 0.1,
					far: 100000,
				}}
			>
				<color attach="background" args={["#e9dd97"]} />
				<pointLight
					position={[0, 0, 3]}
					color="#fcff4b"
					intensity={35}
					castShadow
				/>
				<group receiveShadow castShadow>
					<mesh position={[-1.48, 0, -1]} receiveShadow>
						<boxGeometry args={[1, 2, 1]} />
						<meshBasicMaterial color="#16ebeb" />
					</mesh>
					<mesh position={[1.51, 0, -1]} receiveShadow>
						<boxGeometry args={[1, 2, 1]} />
						<meshBasicMaterial color="#ff3191" />
					</mesh>
				</group>
				{TextInstances}
				<Physics gravity={[0, -2, 0]}>
					<MarchingCubes
						resolution={40}
						maxPolyCount={15000}
						enableUvs={false}
						enableColors
						castShadow
						receiveShadow
					>
						<MeshTransmissionMaterial
							vertexColors
							samples={50}
							resolution={1024}
							toneMapped={false}
							{...Config}
						/>
						<Pointer />
						<>{MetaballInstances}</>
					</MarchingCubes>
				</Physics>

				<Environment preset={"lobby"} />
				<EffectComposer>
					<OrderedDither {...Config} />
				</EffectComposer>
			</Canvas>
		</div>
	);
}

export default App;
