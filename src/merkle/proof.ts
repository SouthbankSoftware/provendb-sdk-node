import * as anchor from "../anchor";
import { Path, Leaf, build } from "./merkle";

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
export function addPathToProof(
    proof: anchor.AnchorProof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): anchor.AnchorProof {
    switch (proof.format) {
        case "CHP_PATH":
            return addPathCHP(proof, hash, algorithm, path, label);
        case "CHP_PATH_SIGNED":
            return addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}

function addPathCHP(
    proof: anchor.AnchorProof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): anchor.AnchorProof {
    // Create new path branch
    let p: any = Object.assign({}, proof.data);
    let branch: any = {
        label: label,
        ops: [],
        branches: p.branches,
    };
    // Loop through each path element and create a CHP path.
    for (let i = 0; i < path.length; i++) {
        let value: any = {
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

interface ValidateProofOptions {
    credentials: string // credentials for API calls.
    isPath: boolean // whether this is a path proof
}

export type ValidateProofOption = (options: ValidateProofOptions) => void;

export function validateProofWithCredentials(credentials: string): ValidateProofOption {
    return function(options: ValidateProofOptions) {
        options.credentials = credentials;
    };
};

export function validateProofWithPath(isPath: boolean): ValidateProofOption {
    return function(options: ValidateProofOptions) {
        options.isPath = isPath;
    };
};

/**
 * Validates the proof by calculating a root hash from the leaves provided, checking it matches the proof's hash, 
 * and validates the proof data with the expected blockchain hash.
 * @param proof the proof
 * @param leaves the leaves
 * @returns true if valid, else false
 */
export function validateProof(proof: anchor.AnchorProof, leaves: string[], algorithm: string, ...opts: ValidateProofOption[]): boolean {
    let options: ValidateProofOptions = {
        credentials: "",
        isPath: false,
    };
    opts.forEach(o => o(options))

    // Ensure proof is CHP and validate it.
    if (anchor.getProofFormat(proof.format) != anchor.Proof.Format.CHP_PATH ||
        anchor.getProofFormat(proof.format) != anchor.Proof.Format.CHP_PATH_SIGNED) {
            throw new Error("proof format not supported")
    }

    // Build the leaves
    let layers: string[][] = build(leaves, algorithm)
    let root = layers[layers.length - 1][0]

    // Check that the root matches the hash associated with the proof.
    return false
}