uniform sampler2D tDiffuse;
uniform float uWeight;
uniform float uDitherScale;
uniform float uDitherIntensity;
uniform int uMatrixSize;
uniform float uDitherX;
uniform float uDitherY;
uniform float uXAmount;
uniform float uYAmount;
uniform float uSeed;
uniform bool uRandomize;


vec2 uResolution = vec2(1200,1200);


float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233) * uSeed)) * 43758.5453);
}


//Define bayer Matrices 2x2,3x3,4x4,8x8

const mat2 bayer2x2 = mat2(1.0, 3.0, 4.0, 2.0) / 4.0;

const mat3 bayer3x3 = mat3(0.0, 7.0, 3.0,
    6.0, 5.0, 2.0,
    4.0, 1.0, 8.0) / 9.0;

//const mat4 bayer4x4 = mat4(0.0, 9.0, 3, 11.0,
//        13.0, 5.0, 15.0, 7.0,
//        4.0, 12.0, 2.0, 10.0,
//        16.0, 8.0, 14.0, 6.0) / 16.0;   


const mat4 bayer4x4 = mat4(0.,  8.,  2., 10.,
                   12., 4., 14., 6.,
                   3., 11., 1., 9.,
                   15., 7., 13., 5.) / 16.0;   
        
float bayer8x8[64] = float[64](
            0.0,  32.0,  8.0,  40.0,  2.0,  34.0, 10.0,  42.0,
            48.0,  16.0, 56.0,  24.0, 50.0,  18.0, 58.0,  26.0,
            12.0,  44.0,  4.0,  36.0, 14.0,  46.0,  6.0,  38.0,
            60.0,  28.0, 52.0,  20.0, 62.0,  30.0, 54.0,  22.0,
            3.0,  35.0, 11.0,  43.0,  1.0,  33.0,  9.0,  41.0,
            51.0,  19.0, 59.0,  27.0, 49.0,  17.0, 57.0,  25.0,
            15.0,  47.0,  7.0,  39.0, 13.0,  45.0,  5.0,  37.0,
            63.0,  31.0, 55.0,  23.0, 61.0,  29.0, 53.0,  21.0
        );

//Define randomized matrices

// 2x2 random matrix
mat2 randomMatrix2x2(float seed) {
    mat2 randomMatrix;
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            randomMatrix[i][j] = rand(vec2(float(i) + seed, float(j) + seed));
        }
    }
    return randomMatrix;
}

// 3x3 random matrix
mat3 randomMatrix3x3(float seed) {
    mat3 randomMatrix;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            float randVal = rand(vec2(float(i) + seed + 0.1, float(j) + seed + 0.1));
            //randomMatrix[i][j] = (randVal * 8.0) / 9.0;
            randomMatrix[i][j] = rand(vec2(float(i) + seed + 0.1, float(j) + seed + 0.1));
        }
    }
    return randomMatrix;
}

// 4x4 random matrix
mat4 randomMatrix4x4(float seed) {
    mat4 randomMatrix;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            float randVal = rand(vec2(float(i) + seed + 0.1, float(j) + seed + 0.1));
            randomMatrix[i][j] = (randVal * 15.0) / 16.0;
            //randomMatrix[i][j] = rand(vec2(float(i) + seed, float(j) + seed));
        }
    }
    return randomMatrix;
}

// 8x8 random matrix
float randomMatrix8x8[64];

void generateRandomMatrix8x8(float seed) {
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            randomMatrix8x8[i*8 + j] = rand(vec2(float(i) + seed, float(j) + seed));
        }
    }
}

// test diagonal matrix
const mat4 diagonalBayer4x4 = mat4(
                0.0, 3.0, 6.0, 9.0,
                1.0, 4.0, 7.0, 10.0,
                2.0, 5.0, 8.0, 11.0,
                15.0, 14.0, 13.0, 12.0
            ) / 15.0;

const float gamma = 2.2;

vec4 linearToGamma(vec4 color) {
    return pow(color, vec4(1.0 / gamma));
}

vec4 gammaToLinear(vec4 color) {
    return pow(color, vec4(gamma));
}

float getGrayscale(vec4 color) {
    //weighted grayscale
    vec3 wG = vec3(0.299, 0.587, 0.114);
    return dot(color.rgb, wG);
}


float contrast =  0.0;
float epsilon = 0.001;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    
float RECIPROCAL_MATRIX_SIZE = 1.0 / float(uMatrixSize * uMatrixSize);

    float dither;
    vec2 ditheredCoord = floor((uv * resolution) / uDitherScale);
    //vec2 positionInMatrix = mod(floor(uv * resolution.xy), 3.0);

    if(uRandomize == false){
        if (uMatrixSize == 2) {
            mat2 matrix = randomMatrix2x2(uSeed);
            dither = matrix[int(mod(ditheredCoord.y, (2.0 + uDitherY )))][int(mod(ditheredCoord.x, (2.0 + uDitherX)))] + RECIPROCAL_MATRIX_SIZE * uXAmount;
            //dither = randomMatrix2x2[int(ditheredCoord.x)%4][int(ditheredCoord.y)%4] ;
        } else if (uMatrixSize == 3) {

            mat3 matrix = randomMatrix3x3(uSeed);
            dither = matrix[int(mod(ditheredCoord.y, (3.0 + uDitherY )))][int(mod(ditheredCoord.x, (3.0 + uDitherX)))] + RECIPROCAL_MATRIX_SIZE * uXAmount;
            //dither = randomMatrix2x2[int(ditheredCoord.x)%4][int(ditheredCoord.y)%4] ;
        } else if (uMatrixSize == 4){
            mat4 matrix = randomMatrix4x4(uSeed);
            dither = matrix[int(mod(ditheredCoord.y, (4.0 + uDitherY )))][int(mod(ditheredCoord.x, (4.0 + uDitherX)))] + RECIPROCAL_MATRIX_SIZE * uXAmount;


        } else if (uMatrixSize == 8){
            generateRandomMatrix8x8(uSeed);
            int row = int(mod(ditheredCoord.x, (8.0 + uDitherX)));
            int col = int(mod(ditheredCoord.y, (8.0 + uDitherY)));
            dither = (randomMatrix8x8[row * 8 + col] + RECIPROCAL_MATRIX_SIZE * uXAmount);
        }{
            inputColor;
        }

    }else if(uRandomize == true)  {
 if (uMatrixSize == 2) {
         dither = bayer2x2[int(mod(ditheredCoord.y, (2.0 + uDitherY)))][int(mod(ditheredCoord.x, (2.0 + uDitherX)))] + RECIPROCAL_MATRIX_SIZE * uXAmount;
         
     } else if (uMatrixSize == 3) {
        dither = bayer3x3[int(mod(ditheredCoord.y, (3.0 + uDitherY )))][int(mod(ditheredCoord.x, (3.0 + uDitherX)))] + RECIPROCAL_MATRIX_SIZE * uXAmount;
     } else if (uMatrixSize == 4) {

         dither = bayer4x4[int(mod(ditheredCoord.y, (4.0 + uDitherY)))][int(mod(ditheredCoord.x, (4.0 + uDitherX) ))] + RECIPROCAL_MATRIX_SIZE * uXAmount;
     } else if (uMatrixSize == 8) {

        //Cannot use the same method as above; must use 1D array to calculate index
        int row = int(mod(ditheredCoord.x, (8.0 + uDitherX)));
        int col = int(mod(ditheredCoord.y, (8.0 + uDitherY)));
        dither = (bayer8x8[row * 8 + col] + RECIPROCAL_MATRIX_SIZE *  (mix(0., uXAmount * 50.,2.3))) / 64.0;
     } {
         inputColor;
     }
    }
 
    float steps = uDitherIntensity;
    vec4 quantizedColor = vec4(vec3(floor(inputColor.rgb * steps)/steps), inputColor.a);
    float grayscale = getGrayscale(quantizedColor);

    float quantDither = floor((grayscale) * (1.1 + uYAmount) + dither);

    
    //Greyscale output
    outputColor = vec4(vec3(quantDither),1.0);
    //COLOR OUTPUT
    