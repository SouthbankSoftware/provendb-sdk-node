"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnchorTypeAsString = exports.getProofFormatAsString = exports.getBatchStatusAsString = exports.getProofFormat = exports.getBatchStatus = exports.getAnchorType = exports.getProofId = void 0;
const anchor_pb_1 = require("./anchor_pb");
/**
 * Generates a proof ID using the proof.hash and proof.batchId
 * @param hash the hash
 * @param batchId the batch ID
 * @returns the proof ID
 */
function getProofId(hash, batchId) {
    return hash + ":" + batchId;
}
exports.getProofId = getProofId;
/**
 * Retrieves the anchor type as the protobuf enum Anchor.Type. If enum
 * anchor type is provided, it is simply returned back.
 *
 * @param anchorType the anchor type
 * @returns the anchor type as enum
 */
function getAnchorType(anchorType) {
    if (typeof anchorType === "string") {
        return anchor_pb_1.Anchor.Type[anchorType];
    }
    return anchorType;
}
exports.getAnchorType = getAnchorType;
/**
 * Retrieves the batch status as the protobuf enum Batch.Status. If enum
 * batch status is provided, it is simply returned back.
 *
 * @param batchStatus the batch status
 * @returns the batch status as enum
 */
function getBatchStatus(batchStatus) {
    if (typeof batchStatus === "string") {
        return anchor_pb_1.Batch.Status[batchStatus];
    }
    return batchStatus;
}
exports.getBatchStatus = getBatchStatus;
/**
 * Retrieves the proof format as the protobuf enum Proof.Format. If enum
 * proof format is provided, it is simply returned back.
 *
 * @param format the proof format
 * @returns the proof format as enum
 */
function getProofFormat(format) {
    if (typeof format === "string") {
        return anchor_pb_1.Proof.Format[format];
    }
    return format;
}
exports.getProofFormat = getProofFormat;
/**
 * Retrieves the enum Batch.Status as a string.
 *
 * @param status the batch status
 * @returns the batch status as string
 */
function getBatchStatusAsString(status) {
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
exports.getBatchStatusAsString = getBatchStatusAsString;
/**
 * Retrieves the enum Proof.Format as a string.
 * @param format the proof format
 * @returns the proof format as string
 */
function getProofFormatAsString(format) {
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
exports.getProofFormatAsString = getProofFormatAsString;
/**
 * Retrieves the enum Anchor.Type as a string.
 * @param anchorType the anchor type
 * @returns the anchor type as string
 */
function getAnchorTypeAsString(anchorType) {
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
exports.getAnchorTypeAsString = getAnchorTypeAsString;
//# sourceMappingURL=util.js.map