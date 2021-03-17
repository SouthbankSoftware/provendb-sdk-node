import chainpointSchema from "chainpoint-proof-json-schema-v4";

/**
 * Chainpoint V4 Proof.
 */
export namespace V4 {
    /**
     * Parse the given object as a Chainpoint V4 Proof.
     * @param obj object to parse
     */
    export function parse(obj: string): Proof {
        if (!chainpointSchema.validate(obj)) {
            throw new Error("unable to parse: invalid object");
        }
        return JSON.parse(obj) as Proof;
    }

    /**
     * Represents a Chainpoint V3 Proof.
     */
    export interface Proof {
        "@context": string;
        type: string;
        proof_id: string;
        hash: string;
        hash_received: string;
        branches: Branch[];
    }

    export interface Branch {
        label?: string;
        ops: Operation[];
        branches: Branch[];
    }

    export interface Operation {
        l?: string;
        r?: string;
        op: string;
        anchors?: Anchor;
    }

    export interface Anchor {
        type: string;
        anchor_id: string;
        uris?: string[];
    }
}
