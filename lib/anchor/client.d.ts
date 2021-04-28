import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import { ServiceError } from "@grpc/grpc-js";
import { AnchorProof } from "./proof";
export declare type ClientOption = (options: ClientOptions) => void;
/**
 * Option to specifiy the Anchor service address.
 * @param address the address
 * @returns the option
 */
export declare function withAddress(address: string): ClientOption;
/**
 * Option to disable SSL/TLS for the connection.
 *
 * @param insecure true to disable, else false.
 * @returns the option
 */
export declare function withInsecure(insecure: boolean): ClientOption;
/**
 * Option to specifiy the credentials for authentication.
 * @param credentials the credentials
 * @returns the option
 */
export declare function withCredentials(credentials: string): ClientOption;
/**
 * Connects to the anchor service and returns a client for requests.
 *
 * @param opts the client options
 * @returns the client
 */
export declare function connect(...opts: ClientOption[]): Client;
interface ClientOptions {
    address: string;
    insecure: boolean;
    credentials: string;
}
export declare type SubmitProofOption = (options: SubmitProofOptions) => void;
interface SubmitProofOptions {
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
interface SubscribeBatchesOptions {
    filter?: {
        batchId: string;
        anchorType: anchor.Anchor.Type;
    };
}
/**
 * Option to subscribe to a batch using a filter.
 * @param filter the filter
 * @returns the option
 */
export declare function subscribeBatchesWithFilter(filter: {
    batchId: string;
    anchorType: anchor.Anchor.Type;
}): SubscribeBatchesOption;
/**
 * A client for the ProvenDB Anchor service. To construct a new client,
 * use {@link connect()}.
 */
export declare class Client {
    private client;
    constructor(client: service.AnchorServiceClient);
    /**
     * Retrieves all available anchors.
     * @returns an array of anchors
     */
    getAnchors(): Promise<anchor.Anchor.AsObject[]>;
    /**
     * Retrieves the availability of a single anchor.
     *
     * @param anchorType the anchor type
     * @returns the anchor
     */
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
    /**
     * Subscribes to batch updates. Batch updates end once a batch is either
     * CONFIRMED or ERROR status.
     *
     * @param callback a callback to retrieve the updates (or error).
     * @param opts subscription options
     */
    subscribeBatch(callback: (err: ServiceError | null, res: anchor.Batch.AsObject) => void, ...opts: SubscribeBatchesOption[]): void;
    /**
     * Subscribes to updates for a previously submitted proof.
     *
     * @param id the proof id
     * @param anchorType the anchor type
     * @param callback the callback
     */
    subscribeProof(id: string, anchorType: string | anchor.Anchor.Type, callback: (err: ServiceError | null, res: AnchorProof) => void): void;
    /**
     * Verifies the given proof.
     *
     * @param proof the proof to verify
     * @returns true if verified, else false.
     */
    verifyProof(proof: AnchorProof): Promise<boolean>;
}
export {};
