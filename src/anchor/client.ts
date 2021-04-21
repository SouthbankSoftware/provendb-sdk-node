import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import {
    credentials,
    status,
    Metadata,
    ChannelCredentials,
    ClientReadableStream,
    ServiceError,
} from "@grpc/grpc-js";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { AnchorProof, toAnchorProof } from "./proof";

export type ClientOption = (options: ClientOptions) => void;

export function withAddress(address: string): ClientOption {
    return function (opts: ClientOptions) {
        opts.address = address;
    };
}

export function withInsecure(insecure: boolean): ClientOption {
    return function (opts: ClientOptions) {
        opts.insecure = insecure;
    };
}

export function withCredentials(credentials: string): ClientOption {
    return function (opts: ClientOptions) {
        opts.credentials = credentials;
    };
}

export function connect(...opts: ClientOption[]): Client {
    let options: ClientOptions = {
        address: "anchor.proofable.io:443",
        insecure: false,
        credentials: "",
    };
    opts.forEach((o) => {
        o(options);
    });
    let chanCred: ChannelCredentials = options.insecure
        ? credentials.createInsecure()
        : credentials.createSsl();
    return new Client(
        new service.AnchorServiceClient(options.address, chanCred)
    );
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
    awaitConfirmed: boolean;
}

export function submitProofWithAnchorType(anchorType: any): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.anchorType = anchorType;
    };
}

export function submitProofWithFormat(format: any): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.format = format;
    };
}

export function submitProofWithSkipBatching(
    skipBatching: boolean
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.skipBatching = skipBatching;
    };
}

export function submitProofWithAwaitConfirmed(
    awaitConfirmed: boolean
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.awaitConfirmed = awaitConfirmed;
    };
}

export type SubscribeBatchesOption = (option: SubscribeBatchesOptions) => void;

export interface SubscribeBatchesOptions {
    filter?: {
        batchId: string;
        anchorType: anchor.Anchor.Type;
    };
}

export function subscribeBatchesWithFilter(filter: {
    batchId: string;
    anchorType: anchor.Anchor.Type;
}): SubscribeBatchesOption {
    return function (options: SubscribeBatchesOptions) {
        options.filter = filter;
    };
}

export class Client {
    constructor(private client: service.AnchorServiceClient) {}

    public getAnchors(): Promise<anchor.Anchor.AsObject[]> {
        return new Promise<anchor.Anchor.AsObject[]>((res, rej) => {
            let r: ClientReadableStream<anchor.Anchor> = this.client.getAnchors(
                new google_protobuf_empty_pb.Empty()
            );
            let anchors: anchor.Anchor.AsObject[] = [];
            r.on("data", (data: anchor.Anchor) => {
                anchors.push(data.toObject());
            });
            r.on("end", () => {
                res(anchors);
            });
            r.on("error", (err: ServiceError) => {
                rej(err);
            });
        });
    }

    public getAnchor(
        anchorType: anchor.Anchor.Type
    ): Promise<anchor.Anchor.AsObject> {
        return new Promise<anchor.Anchor.AsObject>((res, rej) => {
            let req: anchor.AnchorRequest = new anchor.AnchorRequest().setType(
                anchorType
            );
            this.client.getAnchor(req, (err, r) => {
                if (err) {
                    rej(err);
                } else {
                    res(r.toObject());
                }
            });
        });
    }

    public getBatch(
        batchId: string,
        anchorType: anchor.Anchor.Type
    ): Promise<anchor.Batch.AsObject> {
        return new Promise<anchor.Batch.AsObject>((res, rej) => {
            let req: anchor.BatchRequest = new anchor.BatchRequest()
                .setBatchId(batchId)
                .setAnchorType(anchorType);
            this.client.getBatch(req, (err, r) => {
                if (err) {
                    rej(err);
                } else {
                    res(r.toObject());
                }
            });
        });
    }

    public getProof(
        hash: string,
        batchId: string,
        anchorType: anchor.Anchor.Type): Promise<AnchorProof> {
        return new Promise<AnchorProof>((res, rej) => {
            let req = new anchor.ProofRequest()
                .setHash(hash)
                .setBatchId(batchId)
                .setAnchorType(anchorType)
                .setWithBatch(true);
            this.client.getProof(req, (err, r) => {
                if (err) {
                    rej(err);
                } else {
                    res(toAnchorProof(r));
                }
            });
        });
    }

    public submitProof(
        hash: string,
        ...opts: SubmitProofOption[]
    ): Promise<AnchorProof> {
        return new Promise<AnchorProof>((res, rej) => {
            // Set the default options
            let options: SubmitProofOptions = {
                anchorType: anchor.Anchor.Type.ETH,
                format: anchor.Proof.Format.CHP_PATH,
                skipBatching: false,
                awaitConfirmed: false,
            };
            opts.forEach((o) => o(options));

            let req: anchor.SubmitProofRequest = new anchor.SubmitProofRequest()
                .setAnchorType(options.anchorType)
                .setHash(hash)
                .setFormat(options.format)
                .setSkipBatching(options.skipBatching)
                .setWithBatch(true);
            this.client.submitProof(req, (err, r) => {
                if (err) {
                    rej(err);
                } else {
                    // If await confirmed is true, we will subscribe to this proof
                    if (options.awaitConfirmed) {
                        this.subscribeProof(toAnchorProof(r), (err, p) => {
                            if (err) {
                                rej(err);
                            } else {
                                if (p.status === "CONFIRMED") {
                                    res(p);
                                }
                            }
                        });
                    } else {
                        res(toAnchorProof(r));
                    }
                }
            });
        });
    }

    public subscribeBatch(
        callback: (
            err: ServiceError | null,
            res: anchor.Batch.AsObject
        ) => void,
        ...opts: SubscribeBatchesOption[]
    ) {
        let options: SubscribeBatchesOptions = {
            // No filter default.
            filter: undefined,
        };
        opts.forEach((o) => o(options));
        let req = new anchor.SubscribeBatchesRequest();
        if (options.filter) {
            req.setFilter(
                new anchor.BatchRequest()
                    .setBatchId(options.filter.batchId)
                    .setAnchorType(options.filter.anchorType)
            );
        }
        let res: ClientReadableStream<anchor.Batch> = this.client.subscribeBatches(
            req
        );
        res.on("data", (data: anchor.Batch.AsObject) => {
            callback(null, data);
        });
        res.on("error", (err: ServiceError) => {
            callback(err, new anchor.Batch().toObject());
        });
    }

    public subscribeProof(
        proof: AnchorProof,
        callback: (err: ServiceError | null, res: AnchorProof) => void
    ) {
        this.subscribeBatch(
            (err: ServiceError | null, res: anchor.Batch.AsObject) => {
                if (err) {
                    callback(err, toAnchorProof(new anchor.Proof()));
                } else {
                    if (res.status === anchor.Batch.Status.ERROR) {
                        callback(
                            {
                                code: status.INTERNAL,
                                details: res.error,
                                metadata: new Metadata(),
                                name: status.INTERNAL.toString(),
                                message: res.error,
                            },
                            toAnchorProof(new anchor.Proof())
                        );
                        return;
                    }
                    // Retrieve the updated proof
                    this.getProof(
                        proof.hash,
                        proof.batchId,
                        anchor.Anchor.Type[
                            proof.anchorType as keyof typeof anchor.Anchor.Type
                        ]
                    )
                        .then((res) => callback(null, res))
                        .catch((err) =>
                            callback(err, toAnchorProof(new anchor.Proof()))
                        );
                }
            },
            subscribeBatchesWithFilter({
                batchId: proof.batchId,
                anchorType:
                    anchor.Anchor.Type[
                        proof.anchorType as keyof typeof anchor.Anchor.Type
                    ],
            })
        );
    }

    public verifyProof(
        data: string,
        anchorType: anchor.Anchor.Type,
        format: anchor.Proof.Format
    ): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            let req: anchor.VerifyProofRequest = new anchor.VerifyProofRequest()
                .setData(data)
                .setAnchorType(anchorType)
                .setFormat(format);
            this.client.verifyProof(
                req,
                (err: ServiceError | null, r: anchor.VerifyProofReply) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(r.getVerified());
                    }
                }
            );
        });
    }
}
