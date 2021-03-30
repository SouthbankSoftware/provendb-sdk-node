import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import grpc from "@grpc/grpc-js";
import { ClientReadableStream, ServiceError } from "grpc";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

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

export interface GetProofOptions {
    returnBatch: boolean;
}

export type GetProofOption = (option: GetProofOptions) => void;

export function getProofWithReturnBatch(returnBatch: boolean): GetProofOption {
    return function(options: GetProofOptions) {
        options.returnBatch = returnBatch;
    }
}

export class Client {

    constructor(private client: service.AnchorServiceClient) {}

    public getAnchors(callback: (err: ServiceError | null, res: anchor.Anchor[]) => void) {
        let res: ClientReadableStream<anchor.Anchor> = this.client.getAnchors(new google_protobuf_empty_pb.Empty());
        let anchors: anchor.Anchor[] = [];
        res.on("data", (data: anchor.Anchor) => {
            anchors.push();
        })
        res.on("end", () => {
            callback(null, anchors);
        });
        res.on("error", (err: Error) => {
            callback(err, anchors);
        });
    }

    public getAnchor(anchorType: anchor.Anchor.Type, callback: (err: ServiceError | null, res: anchor.Anchor) => void) {
        let req: anchor.AnchorRequest = new anchor.AnchorRequest().setType(anchorType);
        this.client.getAnchor(req, callback);
    }

    public getBatch(batchId: string, anchorType: anchor.Anchor.Type, callback: (err: ServiceError | null, res: anchor.Batch) => void) {
        let req: anchor.BatchRequest = new anchor.BatchRequest()
            .setBatchId(batchId)
            .setAnchorType(anchorType);
        this.client.getBatch(req, callback);
    }

    public getProof(hash: string, 
                    batchId: string, 
                    anchorType: anchor.Anchor.Type, 
                    callback: (err: ServiceError | null, res: anchor.Proof) => void, 
                    ...opts: GetProofOption[]) {
        let options: GetProofOptions = {
            returnBatch: true
        }
        opts.forEach(o => o(options));
        let req = new anchor.ProofRequest()
            .setHash(hash)
            .setBatchId(batchId)
            .setAnchorType(anchorType)
            .setWithBatch(options.returnBatch);
        this.client.getProof(req, callback);
    }

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

    public subscribeProof(proof: anchor.Proof, callback: (err: ServiceError | null, res: anchor.Proof) => void) {
        let req = new anchor.SubscribeBatchesRequest()
            .setFilter(new anchor.BatchRequest()
                .setAnchorType(proof.getAnchorType())
                .setBatchId(proof.getBatchId()));
        let res: ClientReadableStream<anchor.Batch> = this.client.subscribeBatches(req);
        
        res.on("data", (data: anchor.Batch) => {
            if (data.getStatus() === proof.getBatchStatus()) {
                return;
            }
            if (data.getStatus() === anchor.Batch.Status.ERROR) {
                callback(new Error(data.getError()), new anchor.Proof());
                return;
            }
            // Retrieve the updated proof
            this.getProof(proof.getHash(), proof.getBatchId(), proof.getAnchorType(), callback, getProofWithReturnBatch(true));
        });
        res.on("error", (err: Error) => {
            callback(err, new anchor.Proof())
        })
    }
}

