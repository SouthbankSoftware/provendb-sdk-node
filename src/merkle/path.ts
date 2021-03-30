import { Path, Proof } from "./merkle";

// export function addPathToProof(hash: string,
//     proof: Proof,
//     algorithm: string,
//     path: Path[],
//     label?: string) {
//     // Create new path branch
//     let branch: V3.Branch = {
//         label: label,
//         ops: [],
//         branches: proof.branches,
//     };
//     // Loop through each path element and create a CHP path.
//     for (let i = 0; i < path.length; i++) {
//         let value: V3.Operation = {
//             l: path[i].l,
//             r: path[i].r,
//         };
//         branch.ops.push(value);
//         branch.ops.push({ op: algorithm });
//     }
//     // Add the new branch with nested branches.
//     proof.hash = hash;
//     proof.branches = [branch];
//     return proof;
// }
