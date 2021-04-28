"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPathToProof = void 0;
/**
 * Adds a merkle path to an existing proof.
 *
 * @param proof the proof to add the path to
 * @param hash the hash the path begins at
 * @param algorithm the algorithm used to construct the path
 * @param path the path to add
 * @param label the label (description)
 * @returns the updated proof
 */
function addPathToProof(proof, hash, algorithm, path, label) {
    switch (proof.format) {
        case "CHP_PATH":
            return addPathCHP(proof, hash, algorithm, path, label);
        case "CHP_PATH_SIGNED":
            return addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}
exports.addPathToProof = addPathToProof;
function addPathCHP(proof, hash, algorithm, path, label) {
    // Create new path branch
    let p = Object.assign({}, proof.data);
    let branch = {
        label: label,
        ops: [],
        branches: p.branches,
    };
    // Loop through each path element and create a CHP path.
    for (let i = 0; i < path.length; i++) {
        let value = {
            l: path[i].l,
            r: path[i].r,
        };
        branch.ops.push(value);
        branch.ops.push({ op: algorithm });
    }
    // Add the new branch with nested branches.
    p.hash = hash;
    p.branches = [branch];
    return {
        id: proof.id,
        anchorType: proof.anchorType,
        batchId: proof.batchId,
        status: proof.status,
        hash: hash,
        format: proof.format,
        metadata: proof.metadata,
        data: p,
    };
}
//# sourceMappingURL=proof.js.map