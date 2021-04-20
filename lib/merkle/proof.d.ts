import * as anchor from "../anchor";
import { Path } from "./merkle";
/**
 *
 * @param proof the proof to add the path to
 * @param hash the hash the path begins at
 * @param algorithm the algorithm used to construct the path
 * @param path the path to add
 * @param label the label (description)
 * @returns the updated proof
 */
export declare function addPathToProof(proof: anchor.AnchorProof, hash: string, algorithm: string, path: Path[], label?: string): anchor.AnchorProof;
