import service from "./proto/anchor_grpc_pb";
import grpc from "grpc";
import proto from "./proto/anchor_pb";
export { proto, service };
import { Proof } from "./proof";

/**
 * Options for the ProvenDB anchor service.
 */
export interface AnchorOptions {
    address?: string;
    credentials?: string;
    secure?: boolean;
}

/**
 * Creates a new grpc client with appropriate metadata.
 */
export function newClient(options: AnchorOptions): service.AnchorServiceClient {
    let address: string = options.address
        ? options.address
        : "anchor.proofable.io";
    let cred: grpc.ChannelCredentials = options.secure
        ? grpc.credentials.createSsl()
        : grpc.credentials.createInsecure();
    let opts: object = {};
    if (options.credentials) {
        opts = { authorization: "Bearer " + options.credentials };
    }
    return new service.AnchorServiceClient(address, cred);
}

/**
 * Provides a handle on a proof and the underlying functions that can be performed on the proof.
 */
export class ProofHandle {
    /**
     * Constructs a new proof handle.
     * @param options the anchor options
     * @param proof the proof this handle is associated with
     */
    constructor(private options: AnchorOptions, private proof: proto.Proof) {}

    /**
     * Waits for a confirmed status before returns the proof result.
     * @param callback the callback
     */
    async onComplete(): Promise<Proof> {
        return new Promise<Proof>((res, rej) => {
            // Check if the proof is already completed or errored.
            if (this.proof.getBatchStatus() === proto.Batch.Status.ERROR) {
                rej();
            } else if (
                this.proof.getBatchStatus() === proto.Batch.Status.CONFIRMED
            ) {
                res(this.toProof());
            } else {
                // Update the proof periodically
                const i = setInterval(() => {
                    let client: service.AnchorServiceClient = newClient(
                        this.options
                    );
                    let req: proto.ProofRequest = new proto.ProofRequest()
                        .setHash(this.proof.getHash())
                        .setBatchId(this.proof.getBatchId())
                        .setAnchorType(this.proof.getAnchorType())
                        .setWithBatch(true);
                    client.getProof(req, (err, r) => {
                        if (err) {
                            rej(err);
                        } else {
                            this.proof = r;
                            if (
                                this.proof.getBatchStatus() ===
                                proto.Batch.Status.ERROR
                            ) {
                                rej();
                                clearInterval(i);
                            } else if (
                                this.proof.getBatchStatus() ===
                                proto.Batch.Status.CONFIRMED
                            ) {
                                res(this.toProof());
                                clearInterval(i);
                            }
                        }
                    });
                }, 10000);
            }
        });
    }

    /**
     * Converts this anchor's proof to a proof object.
     */
    private toProof(): Proof {
        return new Proof()
            .setAnchorType(this.proof.getAnchorType())
            .setFormat(this.proof.getFormat())
            .setMetadata(JSON.parse(this.proof.getBatch()!.getData()))
            .setData(Proof.decode(this.proof.getData()));
    }
    /**
     * Verifies this proof with the anchor service.
     */
    async verify(): Promise<boolean> {
        return new Promise((res, rej) => {
            let req: proto.VerifyProofRequest = new proto.VerifyProofRequest()
                .setAnchorType(this.proof.getAnchorType())
                .setFormat(this.proof.getFormat())
                .setData(this.proof.getData());

            let client: service.AnchorServiceClient = newClient(this.options);
            client.verifyProof(req, (err, r) => {
                if (err) {
                    rej(err);
                } else if (r.getError()) {
                    rej(r.getError());
                } else {
                    res(r.getVerified());
                }
            });
        });
    }
}
