import { Proof } from "./anchor_pb";
/**
 * AnchorProof is a represention of a Proof object with tasks such as decoding already
 * performed and enums represented as strings for readability.
 */
export interface AnchorProof {
    id: string;
    anchorType: string;
    batchId: string;
    status: string;
    format: string;
    hash: string;
    metadata: any;
    data: any;
}
export declare function toAnchorProof(proof: Proof): AnchorProof;
/**
 * Decodes the given base64 encoded proof.
 * @param data the base64 encoded proof string
 * @returns the proof as an object
 */
export declare function decodeProof(data: string): any;
/**
 * Encodes the given proof by msgpack'ing it, followed by base64 encoding.
 * @param proof the proof to encode
 * @returns the base64 encoded proof
 */
export declare function encodeProof(proof: any): string;
