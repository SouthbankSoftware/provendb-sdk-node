import { Anchor, Batch, Proof } from "./anchor_pb";

export function getProofId(hash: string, batchId: string): string {
    return hash + ":" + batchId;
}

export function getAnchorType(anchorType: string | Anchor.Type): Anchor.Type {
    if (typeof anchorType === 'string') {
        return Anchor.Type[anchorType as keyof typeof Anchor.Type]
    }
    return anchorType;
}

export function getBatchStatus(batchStatus: string | Batch.Status): Batch.Status {
    if (typeof batchStatus === 'string') {
        return Batch.Status[batchStatus as keyof typeof Batch.Status]
    }
    return batchStatus;
}

export function getProofFormat(format: string | Proof.Format): Proof.Format {
    if (typeof format === 'string') {
        return Proof.Format[format as keyof typeof Proof.Format]
    }
    return format;
}

export function getBatchStatusAsString(status: Batch.Status): string {
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

export function getProofFormatAsString(format: Proof.Format): string {
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

export function getAnchorTypeAsString(anchorType: Anchor.Type): string {
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