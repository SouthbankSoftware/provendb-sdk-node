import { encode, decode } from "@msgpack/msgpack";
import zlib from "zlib";
import { Proof } from "./anchor_pb";
import * as util from "./util";

/**
 * AnchorProof is a represention of a Proof object with tasks such as decoding already
 * performed and enums represented as strings for readability.
 */
export interface AnchorProof {
    id: string;
    // Anchor Type.
    anchorType: string;
    // Batch id.
    batchId: string;
    // The status of the proof.
    status: string;
    // Format;
    format: string;
    // The proof's hash.
    hash: string;
    // Any blockchain related metadata. This is contained in the proof's batch data.
    metadata: any;
    // The actual proof.
    data: any;
}

export function toAnchorProof(proof: Proof): AnchorProof {
    let metadata = {}
    if (proof.getBatch()) {
        if (proof.getBatch()?.getData() !== "") {
            metadata = JSON.parse(proof.getBatch()!.getData())
        }
    }
    let data = {}
    if (proof.getData() !== "") {
        data = decodeProof(proof.getData());
    }
    return {
        id: util.getProofId(proof.getHash(), proof.getBatchId()),
        anchorType: util.getAnchorTypeAsString(proof.getAnchorType()),
        format: util.getProofFormatAsString(proof.getFormat()),
        batchId: proof.getBatchId(),
        hash: proof.getHash(),
        status: util.getBatchStatusAsString(proof.getBatchStatus()),
        metadata: metadata,
        data: data,
    };
}

/**
 * Decodes the given base64 encoded proof.
 * @param data the base64 encoded proof string
 * @returns the proof as an object
 */
export function decodeProof(data: string): any {
    let buffer = Buffer.from(data, "base64");
    let msgpack = zlib.inflateSync(buffer);
    return Object.assign({}, decode(msgpack));
}

/**
 * Encodes the given proof by msgpack'ing it, followed by base64 encoding.
 * @param proof the proof to encode
 * @returns the base64 encoded proof
 */
export function encodeProof(proof: any): string {
    let msgpack = encode(proof);
    let buffer = zlib.deflateSync(msgpack);
    return buffer.toString("base64");
}
