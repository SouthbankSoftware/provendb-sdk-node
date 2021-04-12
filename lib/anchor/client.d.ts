import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import { ServiceError } from "@grpc/grpc-js";
export declare type ClientOption = (options: ClientOptions) => void;
export declare function withAddress(address: string): ClientOption;
export declare function withInsecure(insecure: boolean): ClientOption;
export declare function withCredentials(credentials: string): ClientOption;
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
    returnBatch: boolean;
}
export declare function submitProofWithAnchorType(anchorType: any): SubmitProofOption;
export declare function submitProofWithFormat(format: any): SubmitProofOption;
export declare function submitProofWithSkipBatching(skipBatching: boolean): SubmitProofOption;
export declare function submitProofWithReturnBatch(returnBatch: boolean): SubmitProofOption;
export interface GetProofOptions {
    returnBatch: boolean;
}
export declare type GetProofOption = (option: GetProofOptions) => void;
export declare function getProofWithReturnBatch(returnBatch: boolean): GetProofOption;
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
    getAnchors(callback: (err: ServiceError | null, res: anchor.Anchor[]) => void): void;
    getAnchor(anchorType: anchor.Anchor.Type, callback: (err: ServiceError | null, res: anchor.Anchor) => void): void;
    getBatch(batchId: string, anchorType: anchor.Anchor.Type, callback: (err: ServiceError | null, res: anchor.Batch) => void): void;
    getProof(hash: string, batchId: string, anchorType: anchor.Anchor.Type, callback: (err: ServiceError | null, res: anchor.Proof) => void, ...opts: GetProofOption[]): void;
    submitProof(hash: string, callback: (err: ServiceError | null, res: anchor.Proof) => void, ...opts: SubmitProofOption[]): void;
    subscribeBatches(callback: (err: ServiceError | null, res: anchor.Batch) => void, ...opts: SubscribeBatchesOption[]): void;
    subscribeProof(proof: anchor.Proof, callback: (err: ServiceError | null, res: anchor.Proof) => void): void;
    verifyProof(data: string, anchorType: anchor.Anchor.Type, format: anchor.Proof.Format, callback: (err: ServiceError | null, res: boolean) => void): void;
}
