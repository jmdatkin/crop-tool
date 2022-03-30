import { glMatrix, mat3, vec3 } from 'gl-matrix';

glMatrix.setMatrixArrayType(Array);

let currentTransform = mat3.create();
let currentCoords = vec3.create();