import { proto, service } from "./anchor";
import { encode, decode } from "@msgpack/msgpack";
import zlib from "zlib";

/**
 * Representation of a confirmed and complete proof.
 */
export interface Proof {
    // A unique proof ID.
    id: string
    // Metadata about the proof and its transaction.
    metadata: Map<string,any>;
    // The proof data (receipt).
    data: any;
}

//     /**
//      * Encodes the proof data by packing it with msgpack, compressing with zlib, and encoding to base64.
//      */
//     static encode(proof: Proof): string {
//         let msgpack = encode(proof);
//         let buffer = zlib.deflateSync(msgpack);
//         return buffer.toString("base64");
//     }

//     /**
//      * Decodes the proof data.
//      */
//     static decode(proof: string): any {
//         let buffer = Buffer.from(proof, "base64");
//         let msgpack = zlib.inflateSync(buffer);
//         return Object.assign(new Proof(), decode(msgpack));
//     }
// }
