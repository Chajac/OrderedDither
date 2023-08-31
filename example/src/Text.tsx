import { Text3D, useGLTF } from "@react-three/drei";
import { Vector3 } from "react-three-fiber";

useGLTF.preload("/text.glb");

function Text({
	position,
	height,
	color,
}: {
	position: Vector3 | undefined;
	height: number;
	color: string;
}): JSX.Element {
	return (
		<>
			<Text3D
				position={position}
				rotation={[6.3, 0, 0]}
				font="../public/Archivo Narrow_Bold.json"
				castShadow
				bevelEnabled
				scale={0.3}
				letterSpacing={-0.03}
				height={height}
				bevelSize={0.001}
				bevelSegments={5}
				curveSegments={128}
				bevelThickness={0.1}
				receiveShadow
			>
				<meshStandardMaterial color={color} />
				DITHERING
			</Text3D>
		</>
	);
}

export default Text;
