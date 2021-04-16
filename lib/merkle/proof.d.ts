import * as anchor from "../anchor";
import { Path } from "./merkle";
/**
 * Representation of a confirmed and complete proof.
 */
export interface Proof {
    id: string;
    anchorType: anchor.Anchor.Type;
    format: anchor.Proof.Format;
    metadata: any;
    data: any;
}
/**
 * Converts an anchor confirmed proof to a merkle proof.
 * @param proof the anchor proof
 * @returns the merkle proof
 */
export declare function fromAnchorProof(proof: anchor.Proof.AsObject): Proof;
/**
 *
 * @param proof the proof to add the path to
 * @param hash the hash the path begins at
 * @param algorithm the algorithm used to construct the path
 * @param path the path to add
 * @param label the label (description)
 * @returns the updated proof
 */
export declare function addPathToProof(proof: Proof, hash: string, algorithm: string, path: Path[], label?: string): Proof;
