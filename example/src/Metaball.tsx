import * as THREE from "three";
import { MarchingCube } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function Pointer({ vec = new THREE.Vector3() }) {
	const ref = useRef<RapierRigidBody>(null);
	useFrame(({ pointer, viewport }) => {
		if (ref.current) {
			const { width, height } = viewport.getCurrentViewport();
			vec.set(pointer.x * (width / 2), pointer.y * (height / 2), 0);
			ref.current.setNextKinematicTranslation(vec);
		}
	});
	return (
		<RigidBody type="kinematicPosition" colliders={false} ref={ref}>
			<MarchingCube strength={0.41} subtract={2} />
			<mesh receiveShadow castShadow>
				<sphereGeometry args={[0.04]} />
				<meshBasicMaterial color={"#ff0077"} toneMapped={false} />
			</mesh>
			<BallCollider args={[0.24]} />
		</RigidBody>
	);
}

/* function Pointer({ vec = new THREE.Vector3() }) {
	const ref = useRef<any>();
	useFrame(({ mouse, viewport }) => {
		// vec.lerp(
		// 	{
		// 		x: (mouse.x * viewport.width) / 2,
		// 		y: (mouse.y * viewport.height) / 2,
		// 		z: 0,
		// 	},
		// 	0.7
		// );

		const lerpedVec = new THREE.Vector3(
			(mouse.x * viewport.width) / 2,
			(mouse.y * viewport.height) / 2,
			0
		);

		vec.lerp(lerpedVec, 0.7);
		ref.current.setNextKinematicTranslation(vec);
	});
	return (
		<RigidBody
			position={[0, 0, 0]}
			type="kinematicPosition"
			colliders={false}
			ref={ref}
		>
			<mesh>
				<sphereGeometry args={[0.1]} />
				<meshBasicMaterial color="red" toneMapped={false} />
			</mesh>
			<BallCollider args={[5]} />
		</RigidBody>
	);
} */

function MetaBall({ color, vec = new THREE.Vector3(), ...props }) {
	const api = useRef<RapierRigidBody>(null);
	/* 	useFrame((state, delta) => {
		if (api.current) {
			const impulseDirection = new THREE.Vector3(
				5 * delta * 0.0025,
				-2 * delta * 0.0025,
				-5 * delta * 0.0025
			);

			delta = Math.min(0.2, delta);
			api.current.applyImpulse(
				vec
					.copy(api.current.translation())
					.normalize()
					.multiply(
						new THREE.Vector3(
							5 * delta * 0.0025,
							-2 * delta * 0.0025,
							-5 * delta * 0.0025
						)
					)
			);
		}
	}); */

	useFrame((state, delta) => {
		delta = Math.min(delta, 0.01);
		if (api.current) {
			api.current.applyImpulse(
				vec
					.copy(api.current.translation())
					.normalize()
					.multiplyScalar(delta * -1.005)
			);
			api.current.addForce(
				vec
					.copy(api.current.translation())
					.normalize()
					.multiplyScalar(delta * -1.77 * 4.7)
			);
			if (vec.x > 0.015) {
				api.current.applyImpulse(
					vec
						.copy(api.current.translation())
						.normalize()
						.multiplyScalar(delta * 0.02)
				);
			} /* 
		api.current.addTorque({ x: 42, y: 42, z: 0 }); */
		}
	});

	const randomShape = Math.floor(Math.random() * 3);
	const randomSize = Math.random() * (0.04 - 0.02) + 0.02;
	let shapeComponent;
	switch (randomShape) {
		case 0:
			shapeComponent = <sphereGeometry args={[randomSize]} />;
			break;
		case 1:
			shapeComponent = (
				<boxGeometry args={[randomSize, randomSize, randomSize]} />
			);
			break;
		case 2:
			shapeComponent = <tetrahedronGeometry args={[randomSize]} />;
			break;
		default:
			break;
	}

	return (
		<RigidBody
			ref={api}
			colliders={false}
			linearDamping={55}
			angularDamping={22.95}
			{...props}
		>
			<MarchingCube
				strength={0.35}
				subtract={2}
				color={color}
				receiveShadow={true}
				castShadow={true}
			/>
			<mesh receiveShadow={true} castShadow={true}>
				{shapeComponent}
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.5}
				/>
			</mesh>
			<BallCollider args={[0.15]} />
		</RigidBody>
	);
}

export { Pointer, MetaBall };
