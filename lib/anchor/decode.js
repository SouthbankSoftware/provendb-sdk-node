"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProof = exports.decodeProof = void 0;
const msgpack_1 = require("@msgpack/msgpack");
const zlib_1 = __importDefault(require("zlib"));
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
//# sourceMappingURL=decode.js.map