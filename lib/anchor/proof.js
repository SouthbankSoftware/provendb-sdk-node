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
exports.encodeProof = exports.decodeProof = exports.toAnchorProof = void 0;
const msgpack_1 = require("@msgpack/msgpack");
const zlib_1 = __importDefault(require("zlib"));
const util = __importStar(require("./util"));
function toAnchorProof(proof) {
    var _a;
    let metadata = {};
    if (proof.getBatch()) {
        if (((_a = proof.getBatch()) === null || _a === void 0 ? void 0 : _a.getData()) !== "") {
            metadata = JSON.parse(proof.getBatch().getData());
        }
    }
    let data = {};
    if (proof.getData() !== "") {
        data = decodeProof(proof.getData());
    }
    return {
        id: util.getProofId(proof.getHash(), proof.getBatchId()),
        anchorType: util.getAnchorTypeAsString(proof.getAnchorType()),
        format: util.getProofFormatAsString(proof.getFormat()),
        batchId: proof.getBatchId(),
        hash: proof.getHash(),
        status: util.getBatchStatusAsString(proof.getBatchStatus()),
        metadata: metadata,
        data: data,
    };
}
exports.toAnchorProof = toAnchorProof;
/**
 * Decodes the given base64 encoded proof.
 * @param data the base64 encoded proof string
 * @returns the proof as an object
 */
function decodeProof(data) {
    let buffer = Buffer.from(data, "base64");
    let msgpack = zlib_1.default.inflateSync(buffer);
    return Object.assign({}, msgpack_1.decode(msgpack));
}
exports.decodeProof = decodeProof;
/**
 * Encodes the given proof by msgpack'ing it, followed by base64 encoding.
 * @param proof the proof to encode
 * @returns the base64 encoded proof
 */
function encodeProof(proof) {
    let msgpack = msgpack_1.encode(proof);
    let buffer = zlib_1.default.deflateSync(msgpack);
    return buffer.toString("base64");
}
exports.encodeProof = encodeProof;
//# sourceMappingURL=proof.js.map