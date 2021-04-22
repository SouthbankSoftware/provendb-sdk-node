import { Anchor, Batch, Proof } from "./anchor_pb";
export declare function getProofId(hash: string, batchId: string): string;
export declare function getAnchorType(anchorType: string | Anchor.Type): Anchor.Type;
export declare function getBatchStatus(batchStatus: string | Batch.Status): Batch.Status;
export declare function getProofFormat(format: string | Proof.Format): Proof.Format;
export declare function getBatchStatusAsString(status: Batch.Status): string;
export declare function getProofFormatAsString(format: Proof.Format): string;
export declare function getAnchorTypeAsString(anchorType: Anchor.Type): string;
