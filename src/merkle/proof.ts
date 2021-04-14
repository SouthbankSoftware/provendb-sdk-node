import * as anchor from "../anchor";
import { Path } from "./merkle";

/**
 * Representation of a confirmed and complete proof.
 */
export interface Proof {
    id: string;
    // The anchor type.
    anchorType: anchor.Anchor.Type;
    // The proof format.
    format: anchor.Proof.Format;
    // Metadata about the transaction.
    metadata: any;
    // The proof data (receipt).
    data: any;
}

/**
 * Converts an anchor confirmed proof to a merkle proof.
 * @param proof the anchor proof
 * @returns the merkle proof
 */
export function fromAnchorProof(proof: anchor.Proof): Proof {
    let metadata: any = {};
    metadata.format = "";
    return {
        id: proof.getHash() + "-" + proof.getBatchId(),
        anchorType: proof.getAnchorType(),
        format: proof.getFormat(),
        metadata: proof.getBatch()
            ? JSON.parse(proof.getBatch()!.getData())
            : {},
        data: anchor.decodeProof(proof.getData()),
    };
}

/**
 *
 * @param proof the proof to add the path to
 * @param hash the hash the path begins at
 * @param algorithm the algorithm used to construct the path
 * @param path the path to add
 * @param label the label (description)
 * @returns the updated proof
 */
export function addPathToProof(
    proof: Proof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): Proof {
    switch (proof.format) {
        case anchor.Proof.Format.CHP_PATH:
            addPathCHP(proof, hash, algorithm, path, label);
        case anchor.Proof.Format.CHP_PATH_SIGNED:
            addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}

function addPathCHP(
    proof: Proof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): Proof {
    // Create new path branch
    let p: anchor.Chainpoint.V3.Proof = anchor.Chainpoint.V3.parse(proof.data);
    let branch: anchor.Chainpoint.V3.Branch = {
        label: label,
        ops: [],
        branches: p.branches,
    };
    // Loop through each path element and create a CHP path.
    for (let i = 0; i < path.length; i++) {
        let value: anchor.Chainpoint.V3.Operation = {
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
        data: proof.data,
    };
}
