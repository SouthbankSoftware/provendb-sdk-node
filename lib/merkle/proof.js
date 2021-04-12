"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPathToProof = exports.fromAnchorProof = void 0;
const anchor = __importStar(require("../anchor"));
/**
 * Converts an anchor confirmed proof to a merkle proof.
 * @param proof the anchor proof
 * @returns the merkle proof
 */
function fromAnchorProof(proof) {
    let metadata = {};
    metadata.format = "";
    return {
        id: proof.getHash() + "-" + proof.getBatchId(),
        anchorType: proof.getAnchorType(),
        format: proof.getFormat(),
        metadata: proof.getBatch() ? JSON.parse(proof.getBatch().getData()) : {},
        data: anchor.decodeProof(proof.getData())
    };
}
exports.fromAnchorProof = fromAnchorProof;
/**
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
        case anchor.Proof.Format.CHP_PATH:
            addPathCHP(proof, hash, algorithm, path, label);
        case anchor.Proof.Format.CHP_PATH_SIGNED:
            addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}
exports.addPathToProof = addPathToProof;
function addPathCHP(proof, hash, algorithm, path, label) {
    // Create new path branch
    let p = anchor.Chainpoint.V3.parse(proof.data);
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
        format: proof.format,
        metadata: proof.metadata,
        data: proof.data
    };
}
//# sourceMappingURL=proof.js.map