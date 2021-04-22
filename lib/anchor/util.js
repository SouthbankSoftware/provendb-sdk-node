"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnchorTypeAsString = exports.getProofFormatAsString = exports.getBatchStatusAsString = exports.getProofFormat = exports.getBatchStatus = exports.getAnchorType = exports.getProofId = void 0;
const anchor_pb_1 = require("./anchor_pb");
function getProofId(hash, batchId) {
    return hash + ":" + batchId;
}
exports.getProofId = getProofId;
function getAnchorType(anchorType) {
    if (typeof anchorType === 'string') {
        return anchor_pb_1.Anchor.Type[anchorType];
    }
    return anchorType;
}
exports.getAnchorType = getAnchorType;
function getBatchStatus(batchStatus) {
    if (typeof batchStatus === 'string') {
        return anchor_pb_1.Batch.Status[batchStatus];
    }
    return batchStatus;
}
exports.getBatchStatus = getBatchStatus;
function getProofFormat(format) {
    if (typeof format === 'string') {
        return anchor_pb_1.Proof.Format[format];
    }
    return format;
}
exports.getProofFormat = getProofFormat;
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