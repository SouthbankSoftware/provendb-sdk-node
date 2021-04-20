import { encode, decode } from "@msgpack/msgpack";
import zlib from "zlib";
import { Anchor, Batch, Proof } from "./anchor_pb";

/**
 * AnchorProof is a represention of a Proof object with tasks such as decoding already
 * performed and enums represented as strings.
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
        id: proof.getHash() + "-" + proof.getBatchId(),
        anchorType: anchorTypeToString(proof.getAnchorType()),
        format: proofFormatToString(proof.getFormat()),
        batchId: proof.getBatchId(),
        hash: proof.getHash(),
        status: batchStatusToString(proof.getBatchStatus()),
        metadata: metadata,
        data: data,
    };
}

function batchStatusToString(status: Batch.Status): string {
    switch (status) {
        case Batch.Status.BATCHING:
            return "BATCHING"
        case Batch.Status.PENDING:
            return "PENDING"
        case Batch.Status.PROCESSING:
            return "PROCESSING"
        case Batch.Status.QUEUING:
            return "QUEUING"
        case Batch.Status.CONFIRMED:
            return "CONFIRMED"
        case Batch.Status.ERROR:
            return "ERROR"
    }
}

function proofFormatToString(format: Proof.Format): string {
    switch (format) {
        case Proof.Format.CHP_PATH:
            return "CHP_PATH"
        case Proof.Format.CHP_PATH_SIGNED:
            return "CHP_PATH_SIGNED"
        case Proof.Format.ETH_TRIE:
            return "ETH_TRIE"
        case Proof.Format.ETH_TRIE_SIGNED:
            return "ETH_TRIE_SIGNED"
    }
}

function anchorTypeToString(anchorType: Anchor.Type): string {
    switch (anchorType) {
        case Anchor.Type.ETH:
            return "ETH"
        case Anchor.Type.ETH_MAINNET:
            return "ETH_MAINNET"
        case Anchor.Type.ETH_ELASTOS:
            return "ETH_ELASTOS"
        case Anchor.Type.ETH_GOCHAIN:
            return "ETH_GOCHAIN"
        case Anchor.Type.BTC:
            return "BTC"
        case Anchor.Type.BTC_MAINNET:
            return "BTC_MAINNET"
        case Anchor.Type.CHP:
            return "CHP"
        case Anchor.Type.HEDERA:
            return "HEDERA"
        case Anchor.Type.HEDERA_MAINNET:
            return "HEDERA_MAINNET"
        case Anchor.Type.HYPERLEDGER:
            return "HYPERLEDGER"
    }
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
