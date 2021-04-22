import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import { ServiceError } from "@grpc/grpc-js";
import { AnchorProof } from "./proof";
export declare type ClientOption = (options: ClientOptions) => void;
export declare function withAddress(address: string): ClientOption;
export declare function withInsecure(insecure: boolean): ClientOption;
export declare function withCredentials(credentials: string): ClientOption;
/**
 * Connects to the anchor service and returns a client for requests.
 *
 * @param opts the client options
 * @returns the client
 */
export declare function connect(...opts: ClientOption[]): Client;
export interface ClientOptions {
    address: string;
    insecure: boolean;
    credentials: string;
}
export declare type SubmitProofOption = (options: SubmitProofOptions) => void;
export interface SubmitProofOptions {
    anchorType: anchor.Anchor.Type;
    format: anchor.Proof.Format;
    skipBatching: boolean;
    awaitConfirmed: boolean;
}
/**
 * Option to select the anchoring type (blockchain).
 *
 * @param anchorType the anchor type.
 * @returns the option
 */
export declare function submitProofWithAnchorType(anchorType: string | anchor.Anchor.Type): SubmitProofOption;
/**
 * Option to select the proof's structure.
 *
 * @param format the proof format
 * @returns the option
 */
export declare function submitProofWithFormat(format: string | anchor.Proof.Format): SubmitProofOption;
/**
 * Option to skip the batching process.
 *
 * @param skipBatching true to skip batching, else false.
 * @returns the option
 */
export declare function submitProofWithSkipBatching(skipBatching: boolean): SubmitProofOption;
/**
 * Option to await proof confirmation.
 *
 * @param awaitConfirmed true to await proof confirmation, else false.
 * @returns the option
 */
export declare function submitProofWithAwaitConfirmed(awaitConfirmed: boolean): SubmitProofOption;
export declare type SubscribeBatchesOption = (option: SubscribeBatchesOptions) => void;
export interface SubscribeBatchesOptions {
    filter?: {
        batchId: string;
        anchorType: anchor.Anchor.Type;
    };
}
export declare function subscribeBatchesWithFilter(filter: {
    batchId: string;
    anchorType: anchor.Anchor.Type;
}): SubscribeBatchesOption;
export declare class Client {
    private client;
    constructor(client: service.AnchorServiceClient);
    getAnchors(): Promise<anchor.Anchor.AsObject[]>;
    getAnchor(anchorType: anchor.Anchor.Type): Promise<anchor.Anchor.AsObject>;
    /**
     * Retrieves batch information.
     *
     * @param batchId the batch id
     * @param anchorType the anchor type
     * @returns the batch
     */
    getBatch(batchId: string, anchorType: string | anchor.Anchor.Type): Promise<anchor.Batch.AsObject>;
    /**
     * Retrieves a previously submitted proof.
     *
     * @param id the proof id
     * @param anchorType the anchor type
     * @returns the proof
     */
    getProof(id: string, anchorType: string | anchor.Anchor.Type): Promise<AnchorProof>;
    /**
     * Submits a new hash and places it in queue for anchoring.
     *
     * When a proof is first submitted, the anchor service places it in a batch of hashes. After a time limit,
     * the batch's root hash is submitted for anchoring on the chosen blockchain (anchorType). Due do this, when a
     * proof is first submitted, it is still yet to be confirmed until the anchoring and confirmation take place.
     * You may choose to immediately return the submitted proof and then either {@link Client#subscribeProof}
     * to receive updates, or periodically call {@link Client#getProof}.
     *
     * Alternatively, if you would like to receive a response only when a proof is actually confirmed, you can pass the
     * {@link submitProofWithAwaitConfirmed} option set to true. NOTE: If you do pass this option, depending on the chosen
     * blockchain, proofs may take seconds/minutes/hours.
     *
     * @param hash the hash to submit
     * @param opts the options
     * @returns the submitted proof
     */
    submitProof(hash: string, ...opts: SubmitProofOption[]): Promise<AnchorProof>;
    subscribeBatch(callback: (err: ServiceError | null, res: anchor.Batch.AsObject) => void, ...opts: SubscribeBatchesOption[]): void;
    /**
     * Subscribes to updates for a previously submitted proof.
     *
     * @param id the proof id
     * @param anchorType the anchor type
     * @param callback the callback
     */
    subscribeProof(id: string, anchorType: string | anchor.Anchor.Type, callback: (err: ServiceError | null, res: AnchorProof) => void): void;
    verifyProof(data: string, anchorType: anchor.Anchor.Type, format: anchor.Proof.Format): Promise<boolean>;
}
