"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.subscribeBatchesWithFilter = exports.submitProofWithAwaitConfirmed = exports.submitProofWithSkipBatching = exports.submitProofWithFormat = exports.submitProofWithAnchorType = exports.connect = exports.withCredentials = exports.withInsecure = exports.withAddress = void 0;
const anchor = __importStar(require("./anchor_pb"));
const service = __importStar(require("./anchor_grpc_pb"));
const grpc_js_1 = require("@grpc/grpc-js");
const google_protobuf_empty_pb = __importStar(require("google-protobuf/google/protobuf/empty_pb"));
const proof_1 = require("./proof");
const util = __importStar(require("./util"));
function withAddress(address) {
    return function (opts) {
        opts.address = address;
    };
}
exports.withAddress = withAddress;
function withInsecure(insecure) {
    return function (opts) {
        opts.insecure = insecure;
    };
}
exports.withInsecure = withInsecure;
function withCredentials(credentials) {
    return function (opts) {
        opts.credentials = credentials;
    };
}
exports.withCredentials = withCredentials;
/**
 * Connects to the anchor service and returns a client for requests.
 *
 * @param opts the client options
 * @returns the client
 */
function connect(...opts) {
    let options = {
        address: "anchor.proofable.io:443",
        insecure: false,
        credentials: "",
    };
    opts.forEach((o) => {
        o(options);
    });
    let chanCred = options.insecure
        ? grpc_js_1.credentials.createInsecure()
        : grpc_js_1.credentials.createSsl();
    return new Client(new service.AnchorServiceClient(options.address, chanCred));
}
exports.connect = connect;
/**
 * Option to select the anchoring type (blockchain).
 *
 * @param anchorType the anchor type.
 * @returns the option
 */
function submitProofWithAnchorType(anchorType) {
    return function (opts) {
        opts.anchorType = util.getAnchorType(anchorType);
    };
}
exports.submitProofWithAnchorType = submitProofWithAnchorType;
/**
 * Option to select the proof's structure.
 *
 * @param format the proof format
 * @returns the option
 */
function submitProofWithFormat(format) {
    return function (opts) {
        opts.format = util.getProofFormat(format);
    };
}
exports.submitProofWithFormat = submitProofWithFormat;
/**
 * Option to skip the batching process.
 *
 * @param skipBatching true to skip batching, else false.
 * @returns the option
 */
function submitProofWithSkipBatching(skipBatching) {
    return function (opts) {
        opts.skipBatching = skipBatching;
    };
}
exports.submitProofWithSkipBatching = submitProofWithSkipBatching;
/**
 * Option to await proof confirmation.
 *
 * @param awaitConfirmed true to await proof confirmation, else false.
 * @returns the option
 */
function submitProofWithAwaitConfirmed(awaitConfirmed) {
    return function (opts) {
        opts.awaitConfirmed = awaitConfirmed;
    };
}
exports.submitProofWithAwaitConfirmed = submitProofWithAwaitConfirmed;
function subscribeBatchesWithFilter(filter) {
    return function (options) {
        options.filter = filter;
    };
}
exports.subscribeBatchesWithFilter = subscribeBatchesWithFilter;
class Client {
    constructor(client) {
        this.client = client;
    }
    getAnchors() {
        return new Promise((res, rej) => {
            let r = this.client.getAnchors(new google_protobuf_empty_pb.Empty());
            let anchors = [];
            r.on("data", (data) => {
                anchors.push(data.toObject());
            });
            r.on("end", () => {
                res(anchors);
            });
            r.on("error", (err) => {
                rej(err);
            });
        });
    }
    getAnchor(anchorType) {
        return new Promise((res, rej) => {
            let req = new anchor.AnchorRequest().setType(anchorType);
            this.client.getAnchor(req, (err, r) => {
                if (err) {
                    rej(err);
                }
                else {
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
    getBatch(batchId, anchorType) {
        return new Promise((res, rej) => {
            let req = new anchor.BatchRequest()
                .setBatchId(batchId)
                .setAnchorType(util.getAnchorType(anchorType));
            this.client.getBatch(req, (err, r) => {
                if (err) {
                    rej(err);
                }
                else {
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
    getProof(id, anchorType) {
        let s = id.split(":");
        return new Promise((res, rej) => {
            let req = new anchor.ProofRequest()
                .setHash(s[0])
                .setBatchId(s[1])
                .setAnchorType(util.getAnchorType(anchorType))
                .setWithBatch(true);
            this.client.getProof(req, (err, r) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(proof_1.toAnchorProof(r));
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
    submitProof(hash, ...opts) {
        return new Promise((res, rej) => {
            // Set the default options
            let options = {
                anchorType: anchor.Anchor.Type.ETH,
                format: anchor.Proof.Format.CHP_PATH,
                skipBatching: false,
                awaitConfirmed: false,
            };
            opts.forEach((o) => o(options));
            let req = new anchor.SubmitProofRequest()
                .setAnchorType(options.anchorType)
                .setHash(hash)
                .setFormat(options.format)
                .setSkipBatching(options.skipBatching)
                .setWithBatch(true);
            this.client.submitProof(req, (err, r) => {
                if (err) {
                    rej(err);
                }
                else {
                    // If await confirmed is true, we will subscribe to this proof
                    if (options.awaitConfirmed) {
                        this.subscribeProof(util.getProofId(r.getHash(), r.getBatchId()), options.anchorType, (err, p) => {
                            if (err) {
                                rej(err);
                            }
                            else {
                                if (p.status === "CONFIRMED") {
                                    res(p);
                                }
                            }
                        });
                    }
                    else {
                        res(proof_1.toAnchorProof(r));
                    }
                }
            });
        });
    }
    subscribeBatch(callback, ...opts) {
        let options = {
            // No filter default.
            filter: undefined,
        };
        opts.forEach((o) => o(options));
        let req = new anchor.SubscribeBatchesRequest();
        if (options.filter) {
            req.setFilter(new anchor.BatchRequest()
                .setBatchId(options.filter.batchId)
                .setAnchorType(options.filter.anchorType));
        }
        let res = this.client.subscribeBatches(req);
        res.on("data", (data) => {
            callback(null, data);
        });
        res.on("error", (err) => {
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
    subscribeProof(id, anchorType, callback) {
        let s = id.split(":");
        this.subscribeBatch((err, res) => {
            if (err) {
                callback(err, proof_1.toAnchorProof(new anchor.Proof()));
            }
            else {
                if (res.status === anchor.Batch.Status.ERROR) {
                    callback({
                        code: grpc_js_1.status.INTERNAL,
                        details: res.error,
                        metadata: new grpc_js_1.Metadata(),
                        name: grpc_js_1.status.INTERNAL.toString(),
                        message: res.error,
                    }, proof_1.toAnchorProof(new anchor.Proof()));
                    return;
                }
                // Retrieve the updated proof
                this.getProof(id, anchorType)
                    .then((res) => callback(null, res))
                    .catch((err) => callback(err, proof_1.toAnchorProof(new anchor.Proof())));
            }
        }, subscribeBatchesWithFilter({
            batchId: s[1],
            anchorType: util.getAnchorType(anchorType),
        }));
    }
    verifyProof(data, anchorType, format) {
        return new Promise((res, rej) => {
            let req = new anchor.VerifyProofRequest()
                .setData(data)
                .setAnchorType(anchorType)
                .setFormat(format);
            this.client.verifyProof(req, (err, r) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(r.getVerified());
                }
            });
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map