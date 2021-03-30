import * as anchor from "./anchor";
import * as merkle from "./merkle";

let file = {
    algorithm: "sha256",
    layers: [
        [
            "55fb96bf33f19ca574d9616fd4bdeb4ed4840a2120aa63824e436bb35ca3176f",
            "3090ad7f5b83a40b050aad6e04d2f663049aca5cf0253e1b2ff592fcfed3ef9c",
            "0a1a08c0fb4df933139c665db8239da3049a2a9705d49bae9120cd8ec8454314",
            "5e7425d72f32c5c80a5f7a131585657b80723ae22e01fd69776828feb19e3bd5",
        ],
        [
            "4dea1dd6e440e92dd0f61d7c227c2079fb4aa888a0f0e51e7950feab5eb3d0a5",
            "a0bb8d46be3d64116a6a889865b0650c7f4562548dc04499be2cabf9d9284c14",
        ],
        ["2ddb55ee6c7077fc9565a6e1d9f01dde7241252c86807c0aa371fc0fa6e3e2f3"],
    ],
    proofs: [],
};

let tree = new merkle.Tree(file.algorithm, file.layers, file.proofs);
