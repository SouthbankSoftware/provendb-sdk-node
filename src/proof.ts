import { proto, service } from "./anchor";
import { encode, decode } from "@msgpack/msgpack";
import zlib from "zlib";

/**
 * Representation of a confirmed and complete proof.
 */
export class Proof {
    // The anchor type of this proof.
    anchorType: any;
    // The proof format.
    format: any;
    // Metadata about the transaction.
    metadata: any;
    // The proof data (receipt).
    data: any;

    /**
     * Sets the anchor type.
     * @param type the anchor type
     */
    setAnchorType(type: proto.Anchor.Type): Proof {
        this.anchorType = type;
        return this;
    }

    /**
     * Retrieves the anchor type.
     */
    getAnchorType(): proto.Anchor.Type {
        return this.anchorType;
    }

    /**
     * Sets the proof format.
     * @param format the proof format
     */
    setFormat(format: proto.Proof.Format): Proof {
        this.format = format;
        return this;
    }

    /**
     * Retrieves the proof format.
     */
    getFormat(): proto.Proof.Format {
        return this.format;
    }

    /**
     * Sets the transaction metadata.
     * @param metadata the metadata
     */
    setMetadata(metadata: any): Proof {
        this.metadata = metadata;
        return this;
    }

    /**
     * Retrieves the metadata.
     */
    getMetadata(): any {
        return this.metadata;
    }

    /**
     * Sets the data.
     * @param data the data
     */
    setData(data: any): Proof {
        this.data = data;
        return this;
    }

    /**
     * Retrieves the data.
     */
    getData(): any {
        return this.data;
    }

    /**
     * Verifies this proof with the anchor service.
     * @param client the anchor client.
     */
    async verify(client: service.AnchorServiceClient): Promise<boolean> {
        return new Promise((res, rej) => {
            // TODO verify the receipt itself and the path.
            let req: proto.VerifyProofRequest = new proto.VerifyProofRequest()
                .setAnchorType(this.anchorType)
                .setFormat(this.format)
                .setData(Proof.encode(this.data));
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

    /**
     * Encodes the proof data by packing it with msgpack, compressing with zlib, and encoding to base64.
     */
    static encode(proof: Proof): string {
        let msgpack = encode(proof);
        let buffer = zlib.deflateSync(msgpack);
        return buffer.toString("base64");
    }

    /**
     * Decodes the proof data.
     */
    static decode(proof: string): any {
        let buffer = Buffer.from(proof, "base64");
        let msgpack = zlib.inflateSync(buffer);
        return Object.assign(new Proof(), decode(msgpack));
    }
}
