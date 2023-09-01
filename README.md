# Ordered Dither GPU postprocessing effect for React Three Fiber(R3F)

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/p/sandbox/ordered-dither-bayer-r3f-gpu-postprocessing-effect-2jhtxy?file=/src/App.tsx:186,1)


This is a custom post processing effect for React Three Fiber(R3F) that implements an Ordered Dither effect on the gpu via a fragment shader.

## Passable props
```jsx
colorThreshold?: number; // Limit the color range.
ditherScale?: number; // Size of the output dither pattern
dOffsetX?: number; // Add distance between each row. This can produce new patterns but high values are likely to make it look awful.
dOffsetY?: number; // Add distance between each column.
darkThreshold?: number; // Dark threshold, different dithers will require a bit of a play to find something that matches your intent. Particularly 8x8 and 2x2.
lightThreshold?: number; // Light threshold, same as the dark threshold.
randomize?: boolean; // Allows randomization of the matrices via the seed value. This is really likely to produce unstable results but there are gems in there, somewhere.
seed?: number; // Used to drive the above randomization
useColor?: boolean; // Black and White to Color boolean
invertDither?: boolean; // Full color inversion, useage is a bit limited.
matrixSize?: number; // Set the size of the ordered dither, 2,3,4,8 correspond to 2x2,3x3,4x4 and 8x8. Values of 20 and 21 are strictly for the 2x2 horizontal and vertical dithers.
eightNum?: number; // Needs 8x8 matrix to work. Use wwith eightNumAug to effectively adjust the size of the grid - some funky patterns emerge but it mostly breaks the dither.
eightNumAug?: number;
```

## How to implement the dither in your project by importing the component:

```
import { Canvas} from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { OrderedDither } from "../ordered dither/OrderedDither";

function App() {
<Canvas>
// Other render logic
<EffectComposer>
    <OrderedDither  />  
</EffectComposer>
</Canvas>
}
```
Alternatively construct the effect yourself
```
import { forwardRef, useMemo } from "react";
import { Canvas} from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import {IDitherProps, DitherEffect } from "../ordered dither/OrderedDither";

const OrderedDither = forwardRef(
	({ ...props }: IDitherProps, ref: React.ForwardedRef<unknown>) => {
		const effect = useMemo(() => new DitherEffect({ ...props }), [props]);
		return <primitive object={effect} dispose={null} ref={ref} />;
	}
);

function App() {
<Canvas>
// Other render logic
<EffectComposer>
    <OrderedDither  />  
</EffectComposer>
</Canvas>
}
```
