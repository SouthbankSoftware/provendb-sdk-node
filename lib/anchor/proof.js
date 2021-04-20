"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProof = exports.decodeProof = exports.toAnchorProof = void 0;
const msgpack_1 = require("@msgpack/msgpack");
const zlib_1 = __importDefault(require("zlib"));
const anchor_pb_1 = require("./anchor_pb");
function toAnchorProof(proof) {
    var _a;
    let metadata = {};
    if (proof.getBatch()) {
        if (((_a = proof.getBatch()) === null || _a === void 0 ? void 0 : _a.getData()) !== "") {
            metadata = JSON.parse(proof.getBatch().getData());
        }
    }
    let data = {};
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
exports.toAnchorProof = toAnchorProof;
function batchStatusToString(status) {
    switch (status) {
        case anchor_pb_1.Batch.Status.BATCHING:
            return "BATCHING";
        case anchor_pb_1.Batch.Status.PENDING:
            return "PENDING";
        case anchor_pb_1.Batch.Status.PROCESSING:
            return "PROCESSING";
        case anchor_pb_1.Batch.Status.QUEUING:
            return "QUEUING";
        case anchor_pb_1.Batch.Status.CONFIRMED:
            return "CONFIRMED";
        case anchor_pb_1.Batch.Status.ERROR:
            return "ERROR";
    }
}
function proofFormatToString(format) {
    switch (format) {
        case anchor_pb_1.Proof.Format.CHP_PATH:
            return "CHP_PATH";
        case anchor_pb_1.Proof.Format.CHP_PATH_SIGNED:
            return "CHP_PATH_SIGNED";
        case anchor_pb_1.Proof.Format.ETH_TRIE:
            return "ETH_TRIE";
        case anchor_pb_1.Proof.Format.ETH_TRIE_SIGNED:
            return "ETH_TRIE_SIGNED";
    }
}
function anchorTypeToString(anchorType) {
    switch (anchorType) {
        case anchor_pb_1.Anchor.Type.ETH:
            return "ETH";
        case anchor_pb_1.Anchor.Type.ETH_MAINNET:
            return "ETH_MAINNET";
        case anchor_pb_1.Anchor.Type.ETH_ELASTOS:
            return "ETH_ELASTOS";
        case anchor_pb_1.Anchor.Type.ETH_GOCHAIN:
            return "ETH_GOCHAIN";
        case anchor_pb_1.Anchor.Type.BTC:
            return "BTC";
        case anchor_pb_1.Anchor.Type.BTC_MAINNET:
            return "BTC_MAINNET";
        case anchor_pb_1.Anchor.Type.CHP:
            return "CHP";
        case anchor_pb_1.Anchor.Type.HEDERA:
            return "HEDERA";
        case anchor_pb_1.Anchor.Type.HEDERA_MAINNET:
            return "HEDERA_MAINNET";
        case anchor_pb_1.Anchor.Type.HYPERLEDGER:
            return "HYPERLEDGER";
    }
}
/**
 * Decodes the given base64 encoded proof.
 * @param data the base64 encoded proof string
 * @returns the proof as an object
 */
function decodeProof(data) {
    let buffer = Buffer.from(data, "base64");
    let msgpack = zlib_1.default.inflateSync(buffer);
    return Object.assign({}, msgpack_1.decode(msgpack));
}
exports.decodeProof = decodeProof;
/**
 * Encodes the given proof by msgpack'ing it, followed by base64 encoding.
 * @param proof the proof to encode
 * @returns the base64 encoded proof
 */
function encodeProof(proof) {
    let msgpack = msgpack_1.encode(proof);
    let buffer = zlib_1.default.deflateSync(msgpack);
    return buffer.toString("base64");
}
exports.encodeProof = encodeProof;
//# sourceMappingURL=proof.js.map