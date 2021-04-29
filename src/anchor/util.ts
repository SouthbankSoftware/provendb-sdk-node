import { Anchor, Batch, Proof } from "./anchor_pb";

/**
 * Generates a proof ID using the proof.hash and proof.batchId
 * @param hash the hash
 * @param batchId the batch ID
 * @returns the proof ID
 */
export function getProofId(hash: string, batchId: string): string {
    return hash + ":" + batchId;
}

/**
 * Retrieves the anchor type as the protobuf enum Anchor.Type. If enum
 * anchor type is provided, it is simply returned back.
 *
 * @param anchorType the anchor type
 * @returns the anchor type as enum
 */
export function getAnchorType(anchorType: string | Anchor.Type): Anchor.Type {
    if (typeof anchorType === "string") {
        return Anchor.Type[anchorType as keyof typeof Anchor.Type];
    }
    return anchorType;
}

/**
 * Retrieves the batch status as the protobuf enum Batch.Status. If enum
 * batch status is provided, it is simply returned back.
 *
 * @param batchStatus the batch status
 * @returns the batch status as enum
 */
export function getBatchStatus(
    batchStatus: string | Batch.Status
): Batch.Status {
    if (typeof batchStatus === "string") {
        return Batch.Status[batchStatus as keyof typeof Batch.Status];
    }
    return batchStatus;
}

/**
 * Retrieves the proof format as the protobuf enum Proof.Format. If enum
 * proof format is provided, it is simply returned back.
 *
 * @param format the proof format
 * @returns the proof format as enum
 */
export function getProofFormat(format: string | Proof.Format): Proof.Format {
    if (typeof format === "string") {
        return Proof.Format[format as keyof typeof Proof.Format];
    }
    return format;
}

/**
 * Retrieves the enum Batch.Status as a string.
 *
 * @param status the batch status
 * @returns the batch status as string
 */
export function getBatchStatusAsString(status: Batch.Status): string {
    switch (status) {
        case Batch.Status.BATCHING:
            return "BATCHING";
        case Batch.Status.PENDING:
            return "PENDING";
        case Batch.Status.PROCESSING:
            return "PROCESSING";
        case Batch.Status.QUEUING:
            return "QUEUING";
        case Batch.Status.CONFIRMED:
            return "CONFIRMED";
        case Batch.Status.ERROR:
            return "ERROR";
    }
}

/**
 * Retrieves the enum Proof.Format as a string.
 * @param format the proof format
 * @returns the proof format as string
 */
export function getProofFormatAsString(format: Proof.Format): string {
    switch (format) {
        case Proof.Format.CHP_PATH:
            return "CHP_PATH";
        case Proof.Format.CHP_PATH_SIGNED:
            return "CHP_PATH_SIGNED";
        case Proof.Format.ETH_TRIE:
            return "ETH_TRIE";
        case Proof.Format.ETH_TRIE_SIGNED:
            return "ETH_TRIE_SIGNED";
    }
}

/**
 * Retrieves the enum Anchor.Type as a string.
 * @param anchorType the anchor type
 * @returns the anchor type as string
 */
export function getAnchorTypeAsString(anchorType: Anchor.Type): string {
    switch (anchorType) {
        case Anchor.Type.ETH:
            return "ETH";
        case Anchor.Type.ETH_MAINNET:
            return "ETH_MAINNET";
        case Anchor.Type.ETH_ELASTOS:
            return "ETH_ELASTOS";
        case Anchor.Type.ETH_GOCHAIN:
            return "ETH_GOCHAIN";
        case Anchor.Type.BTC:
            return "BTC";
        case Anchor.Type.BTC_MAINNET:
            return "BTC_MAINNET";
        case Anchor.Type.CHP:
            return "CHP";
        case Anchor.Type.HEDERA:
            return "HEDERA";
        case Anchor.Type.HEDERA_MAINNET:
            return "HEDERA_MAINNET";
        case Anchor.Type.HYPERLEDGER:
            return "HYPERLEDGER";
    }
}
