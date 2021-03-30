import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import grpc from "@grpc/grpc-js";
import { ServiceError } from "grpc";

export type ClientOption = (options: ClientOptions) => void;

export function withAddress(address: string): ClientOption {
    return function(opts: ClientOptions) {
        opts.address = address;
    }
}

export function withInsecure(insecure: boolean): ClientOption {
    return function(opts: ClientOptions) {
        opts.insecure = insecure;
    }
}

export function withCredentials(credentials: string): ClientOption {
    return function(opts: ClientOptions) {
        opts.credentials = credentials;
    }
}

export function connect(...opts: ClientOption[]): Client {
    let options: ClientOptions = {
        address: "anchor.proofable.io:443",
        insecure: false,
        credentials: ""
    }
    opts.forEach(o => {
        o(options);
    })
    let chanCred: grpc.ChannelCredentials = options.insecure ? grpc.credentials.createInsecure() : grpc.credentials.createSsl();
    return new Client(new service.AnchorServiceClient(options.address, chanCred));
}

export interface ClientOptions {
    address: string;
    insecure: boolean;
    credentials: string;
}

export type SubmitProofOption = (options: SubmitProofOptions) => void;

export interface SubmitProofOptions {
    anchorType: anchor.Anchor.Type;
    format: anchor.Proof.Format;
    skipBatching: boolean;
    returnBatch: boolean;
}

export function submitProofWithAnchorType(anchorType: any): SubmitProofOption {
    return function(opts: SubmitProofOptions) {
        opts.anchorType = anchorType;
    }
}

export function submitProofWithFormat(format: any): SubmitProofOption {
    return function(opts: SubmitProofOptions) {
        opts.format = format;
    }
}

export function submitProofWithSkipBatching(skipBatching: boolean): SubmitProofOption {
    return function(opts: SubmitProofOptions) {
        opts.skipBatching = skipBatching;
    }
}

export function submitProofWithReturnBatch(returnBatch: boolean): SubmitProofOption {
    return function(opts: SubmitProofOptions) {
        opts.returnBatch = returnBatch
    }
}

export class Client {

    constructor(private client: service.AnchorServiceClient) {}

    public submitProof(hash: string, callback: (err: ServiceError | null, res: anchor.Proof) => void, ...opts: SubmitProofOption[]) {
        // Set the default options
        let options: SubmitProofOptions = {
            anchorType: anchor.Anchor.Type.ETH,
            format: anchor.Proof.Format.CHP_PATH,
            skipBatching: false,
            returnBatch: true
        }
        opts.forEach(o => o(options))

        let req: anchor.SubmitProofRequest = new anchor.SubmitProofRequest()
            .setAnchorType(options.anchorType)
            .setHash(hash)
            .setFormat(options.format)
            .setSkipBatching(options.skipBatching)
            .setWithBatch(options.returnBatch)
        this.client.submitProof(req, callback);
    }  
}

