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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.subscribeBatchesWithFilter = exports.getProofWithReturnBatch = exports.submitProofWithReturnBatch = exports.submitProofWithSkipBatching = exports.submitProofWithFormat = exports.submitProofWithAnchorType = exports.connect = exports.withCredentials = exports.withInsecure = exports.withAddress = void 0;
const anchor = __importStar(require("./anchor_pb"));
const service = __importStar(require("./anchor_grpc_pb"));
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const google_protobuf_empty_pb = __importStar(require("google-protobuf/google/protobuf/empty_pb"));
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
        ? grpc_js_1.default.credentials.createInsecure()
        : grpc_js_1.default.credentials.createSsl();
    return new Client(new service.AnchorServiceClient(options.address, chanCred));
}
exports.connect = connect;
function submitProofWithAnchorType(anchorType) {
    return function (opts) {
        opts.anchorType = anchorType;
    };
}
exports.submitProofWithAnchorType = submitProofWithAnchorType;
function submitProofWithFormat(format) {
    return function (opts) {
        opts.format = format;
    };
}
exports.submitProofWithFormat = submitProofWithFormat;
function submitProofWithSkipBatching(skipBatching) {
    return function (opts) {
        opts.skipBatching = skipBatching;
    };
}
exports.submitProofWithSkipBatching = submitProofWithSkipBatching;
function submitProofWithReturnBatch(returnBatch) {
    return function (opts) {
        opts.returnBatch = returnBatch;
    };
}
exports.submitProofWithReturnBatch = submitProofWithReturnBatch;
function getProofWithReturnBatch(returnBatch) {
    return function (options) {
        options.returnBatch = returnBatch;
    };
}
exports.getProofWithReturnBatch = getProofWithReturnBatch;
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
    getAnchors(callback) {
        let res = this.client.getAnchors(new google_protobuf_empty_pb.Empty());
        let anchors = [];
        res.on("data", (data) => {
            anchors.push();
        });
        res.on("end", () => {
            callback(null, anchors);
        });
        res.on("error", (err) => {
            callback(err, anchors);
        });
    }
    getAnchor(anchorType, callback) {
        let req = new anchor.AnchorRequest().setType(anchorType);
        this.client.getAnchor(req, callback);
    }
    getBatch(batchId, anchorType, callback) {
        let req = new anchor.BatchRequest()
            .setBatchId(batchId)
            .setAnchorType(anchorType);
        this.client.getBatch(req, callback);
    }
    getProof(hash, batchId, anchorType, callback, ...opts) {
        let options = {
            returnBatch: true,
        };
        opts.forEach((o) => o(options));
        let req = new anchor.ProofRequest()
            .setHash(hash)
            .setBatchId(batchId)
            .setAnchorType(anchorType)
            .setWithBatch(options.returnBatch);
        this.client.getProof(req, callback);
    }
    submitProof(hash, callback, ...opts) {
        // Set the default options
        let options = {
            anchorType: anchor.Anchor.Type.ETH,
            format: anchor.Proof.Format.CHP_PATH,
            skipBatching: false,
            returnBatch: true,
        };
        opts.forEach((o) => o(options));
        let req = new anchor.SubmitProofRequest()
            .setAnchorType(options.anchorType)
            .setHash(hash)
            .setFormat(options.format)
            .setSkipBatching(options.skipBatching)
            .setWithBatch(options.returnBatch);
        this.client.submitProof(req, callback);
    }
    subscribeBatches(callback, ...opts) {
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
            callback(err, new anchor.Batch());
        });
    }
    subscribeProof(proof, callback) {
        this.subscribeBatches((err, res) => {
            if (err) {
                callback(err, new anchor.Proof());
            }
            else {
                if (res.getStatus() === anchor.Batch.Status.ERROR) {
                    callback({
                        code: grpc_js_1.default.status.INTERNAL,
                        details: res.getError(),
                        metadata: new grpc_js_1.default.Metadata(),
                        name: grpc_js_1.default.status.INTERNAL.toString(),
                        message: res.getError()
                    }, new anchor.Proof());
                    return;
                }
                // Retrieve the updated proof
                this.getProof(proof.getHash(), proof.getBatchId(), proof.getAnchorType(), callback, getProofWithReturnBatch(true));
            }
        }, subscribeBatchesWithFilter({ batchId: proof.getBatchId(), anchorType: proof.getAnchorType() }));
    }
    verifyProof(data, anchorType, format, callback) {
        let req = new anchor.VerifyProofRequest()
            .setData(data)
            .setAnchorType(anchorType)
            .setFormat(format);
        this.client.verifyProof(req, (err, res) => {
            if (err) {
                callback(err, false);
            }
            else {
                callback(null, res.getVerified());
            }
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map