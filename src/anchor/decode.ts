import { encode, decode } from "@msgpack/msgpack";
import zlib from "zlib";

/**
 * Decodes the given base64 encoded proof.
 * @param data the base64 encoded proof string
 * @returns the proof as an object
 */
export function decodeProof(data: string): any {
    let buffer = Buffer.from(data, "base64");
    let msgpack = zlib.inflateSync(buffer);
    return Object.assign({}, decode(msgpack));
}

/**
 * Encodes the given proof by msgpack'ing it, followed by base64 encoding.
 * @param proof the proof to encode
 * @returns the base64 encoded proof
 */
export function encodeProof(proof: any): string {
    let msgpack = encode(proof);
    let buffer = zlib.deflateSync(msgpack);
    return buffer.toString("base64");
}