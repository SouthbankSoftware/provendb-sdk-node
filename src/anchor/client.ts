import * as anchor from "./anchor_pb";
import * as service from "./anchor_grpc_pb";
import {
    credentials,
    status,
    Metadata,
    ChannelCredentials,
    CallCredentials,
    ClientReadableStream,
    ServiceError,
} from "@grpc/grpc-js";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import { AnchorProof, encodeProof, toAnchorProof } from "./proof";
import * as util from "./util";

export type ClientOption = (options: ClientOptions) => void;

/**
 * Option to specifiy the Anchor service address.
 * @param address the address
 * @returns the option
 */
export function withAddress(address: string): ClientOption {
    return function (opts: ClientOptions) {
        opts.address = address;
    };
}

/**
 * Option to disable SSL/TLS for the connection.
 *
 * @param insecure true to disable, else false.
 * @returns the option
 */
export function withInsecure(insecure: boolean): ClientOption {
    return function (opts: ClientOptions) {
        opts.insecure = insecure;
    };
}

/**
 * Option to specifiy the credentials for authentication.
 * @param credentials the credentials
 * @returns the option
 */
export function withCredentials(credentials: string): ClientOption {
    return function (opts: ClientOptions) {
        opts.credentials = credentials;
    };
}

/**
 * Connects to the anchor service and returns a client for requests.
 *
 * @param opts the client options
 * @returns the client
 */
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

    // call credentials
    const metaCallback = (
        params: any,
        callback: (err: Error | null, metadata?: Metadata) => void
    ) => {
        const meta = new Metadata();
        meta.add("authorization", options.credentials);
        callback(null, meta);
    };
    let callCreds: CallCredentials = credentials.createFromMetadataGenerator(
        metaCallback
    );
    return new Client(
        new service.AnchorServiceClient(
            options.address,
            credentials.combineChannelCredentials(chanCred, callCreds)
        )
    );
}

interface ClientOptions {
    address: string;
    insecure: boolean;
    credentials: string;
}

export type SubmitProofOption = (options: SubmitProofOptions) => void;

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
export function submitProofWithAnchorType(
    anchorType: string | anchor.Anchor.Type
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.anchorType = util.getAnchorType(anchorType);
    };
}

/**
 * Option to select the proof's structure.
 *
 * @param format the proof format
 * @returns the option
 */
export function submitProofWithFormat(
    format: string | anchor.Proof.Format
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.format = util.getProofFormat(format);
    };
}

/**
 * Option to skip the batching process.
 *
 * @param skipBatching true to skip batching, else false.
 * @returns the option
 */
export function submitProofWithSkipBatching(
    skipBatching: boolean
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.skipBatching = skipBatching;
    };
}

/**
 * Option to await proof confirmation.
 *
 * @param awaitConfirmed true to await proof confirmation, else false.
 * @returns the option
 */
export function submitProofWithAwaitConfirmed(
    awaitConfirmed: boolean
): SubmitProofOption {
    return function (opts: SubmitProofOptions) {
        opts.awaitConfirmed = awaitConfirmed;
    };
}

export type SubscribeBatchesOption = (option: SubscribeBatchesOptions) => void;

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
export function subscribeBatchesWithFilter(filter: {
    batchId: string;
    anchorType: anchor.Anchor.Type;
}): SubscribeBatchesOption {
    return function (options: SubscribeBatchesOptions) {
        options.filter = filter;
    };
}

/**
 * A client for the ProvenDB Anchor service. To construct a new client,
 * use {@link connect()}.
 */
export class Client {
    constructor(private client: service.AnchorServiceClient) {}

    /**
     * Retrieves all available anchors.
     * @returns an array of anchors
     */
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

    /**
     * Retrieves the availability of a single anchor.
     *
     * @param anchorType the anchor type
     * @returns the anchor
     */
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

    /**
     * Retrieves batch information.
     *
     * @param batchId the batch id
     * @param anchorType the anchor type
     * @returns the batch
     */
    public getBatch(
        batchId: string,
        anchorType: string | anchor.Anchor.Type
    ): Promise<anchor.Batch.AsObject> {
        return new Promise<anchor.Batch.AsObject>((res, rej) => {
            let req: anchor.BatchRequest = new anchor.BatchRequest()
                .setBatchId(batchId)
                .setAnchorType(util.getAnchorType(anchorType));
            this.client.getBatch(req, (err, r) => {
                if (err) {
                    rej(err);
                } else {
                    res(r.toObject());
                }
            });
        });
    }

    /**
     * Retrieves a previously submitted proof.
     *
     * @param id the proof id
     * @param anchorType the anchor type
     * @returns the proof
     */
    public getProof(
        id: string,
        anchorType: string | anchor.Anchor.Type
    ): Promise<AnchorProof> {
        let s: string[] = id.split(":");
        return new Promise<AnchorProof>((res, rej) => {
            let req = new anchor.ProofRequest()
                .setHash(s[0])
                .setBatchId(s[1])
                .setAnchorType(util.getAnchorType(anchorType))
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
    public submitProof(
        hash: string,
        ...opts: SubmitProofOption[]
    ): Promise<AnchorProof> {
        return new Promise<AnchorProof>((res, rej) => {
            // Set the default options
            let options: SubmitProofOptions = {
                anchorType: anchor.Anchor.Type.HEDERA_MAINNET,
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
                        this.subscribeProof(
                            util.getProofId(r.getHash(), r.getBatchId()),
                            options.anchorType,
                            (err, p) => {
                                if (err) {
                                    rej(err);
                                } else {
                                    if (p.status === "CONFIRMED") {
                                        res(p);
                                    }
                                }
                            }
                        );
                    } else {
                        res(toAnchorProof(r));
                    }
                }
            });
        });
    }

    /**
     * Subscribes to batch updates. Batch updates end once a batch is either
     * CONFIRMED or ERROR status.
     *
     * @param callback a callback to retrieve the updates (or error).
     * @param opts subscription options
     */
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

    /**
     * Subscribes to updates for a previously submitted proof.
     *
     * @param id the proof id
     * @param anchorType the anchor type
     * @param callback the callback
     */
    public subscribeProof(
        id: string,
        anchorType: string | anchor.Anchor.Type,
        callback: (err: ServiceError | null, res: AnchorProof) => void
    ) {
        let s: string[] = id.split(":");
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
                    this.getProof(id, anchorType)
                        .then((res) => callback(null, res))
                        .catch((err) =>
                            callback(err, toAnchorProof(new anchor.Proof()))
                        );
                }
            },
            subscribeBatchesWithFilter({
                batchId: s[1],
                anchorType: util.getAnchorType(anchorType),
            })
        );
    }

    /**
     * Verifies the given proof.
     *
     * @param proof the proof to verify
     * @returns true if verified, else false.
     */
    public verifyProof(proof: AnchorProof): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            let req: anchor.VerifyProofRequest = new anchor.VerifyProofRequest()
                .setData(encodeProof(proof.data))
                .setAnchorType(util.getAnchorType(proof.anchorType))
                .setFormat(util.getProofFormat(proof.format));
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
