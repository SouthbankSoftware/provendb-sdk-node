import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import { ServiceError } from "@grpc/grpc-js";
import { AnchorProof } from "./proof";
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
    awaitConfirmed: boolean;
}
export declare function submitProofWithAnchorType(anchorType: any): SubmitProofOption;
export declare function submitProofWithFormat(format: any): SubmitProofOption;
export declare function submitProofWithSkipBatching(skipBatching: boolean): SubmitProofOption;
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
    getBatch(batchId: string, anchorType: anchor.Anchor.Type): Promise<anchor.Batch.AsObject>;
    getProof(id: string, anchorType: string | anchor.Anchor.Type): Promise<AnchorProof>;
    submitProof(hash: string, ...opts: SubmitProofOption[]): Promise<AnchorProof>;
    subscribeBatch(callback: (err: ServiceError | null, res: anchor.Batch.AsObject) => void, ...opts: SubscribeBatchesOption[]): void;
    subscribeProof(id: string, anchorType: string | anchor.Anchor.Type, callback: (err: ServiceError | null, res: AnchorProof) => void): void;
    verifyProof(data: string, anchorType: anchor.Anchor.Type, format: anchor.Proof.Format): Promise<boolean>;
}
