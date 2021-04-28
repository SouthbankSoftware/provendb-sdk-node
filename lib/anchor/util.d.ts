import { Anchor, Batch, Proof } from "./anchor_pb";
/**
 * Generates a proof ID using the proof.hash and proof.batchId
 * @param hash the hash
 * @param batchId the batch ID
 * @returns the proof ID
 */
export declare function getProofId(hash: string, batchId: string): string;
/**
 * Retrieves the anchor type as the protobuf enum Anchor.Type. If enum
 * anchor type is provided, it is simply returned back.
 *
 * @param anchorType the anchor type
 * @returns the anchor type as enum
 */
export declare function getAnchorType(anchorType: string | Anchor.Type): Anchor.Type;
/**
 * Retrieves the batch status as the protobuf enum Batch.Status. If enum
 * batch status is provided, it is simply returned back.
 *
 * @param batchStatus the batch status
 * @returns the batch status as enum
 */
export declare function getBatchStatus(batchStatus: string | Batch.Status): Batch.Status;
/**
 * Retrieves the proof format as the protobuf enum Proof.Format. If enum
 * proof format is provided, it is simply returned back.
 *
 * @param format the proof format
 * @returns the proof format as enum
 */
export declare function getProofFormat(format: string | Proof.Format): Proof.Format;
/**
 * Retrieves the enum Batch.Status as a string.
 *
 * @param status the batch status
 * @returns the batch status as string
 */
export declare function getBatchStatusAsString(status: Batch.Status): string;
/**
 * Retrieves the enum Proof.Format as a string.
 * @param format the proof format
 * @returns the proof format as string
 */
export declare function getProofFormatAsString(format: Proof.Format): string;
/**
 * Retrieves the enum Anchor.Type as a string.
 * @param anchorType the anchor type
 * @returns the anchor type as string
 */
export declare function getAnchorTypeAsString(anchorType: Anchor.Type): string;
