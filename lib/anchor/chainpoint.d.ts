export declare namespace Chainpoint {
    /**
     * Chainpoint V3 Proof.
     */
    namespace V3 {
        /**
         * Parse the given object as a Chainpoint V3 Proof.
         * @param obj object to parse
         */
        function parse(obj: any): Proof;
        /**
         * Represents a Chainpoint V3 Proof.
         */
        interface Proof {
            "@context": string;
            type: string;
            hash: string;
            hash_id_node: string;
            hash_submitted_node_at: string;
            hash_id_core: string;
            hash_submitted_core_at: string;
            branches: Branch[];
        }
        interface Branch {
            label?: string;
            ops: Operation[];
            branches: Branch[];
        }
        interface Operation {
            l?: string;
            r?: string;
            op?: string;
            anchors?: Anchor;
        }
        interface Anchor {
            type: string;
            anchor_id: string;
            uris?: string[];
        }
    }
    /**
     * Chainpoint V4 Proof.
     */
    namespace V4 {
        /**
         * Parse the given object as a Chainpoint V4 Proof.
         * @param obj object to parse
         */
        function parse(obj: any): Proof;
        /**
         * Represents a Chainpoint V3 Proof.
         */
        interface Proof {
            "@context": string;
            type: string;
            proof_id: string;
            hash: string;
            hash_received: string;
            branches: Branch[];
        }
        interface Branch {
            label?: string;
            ops: Operation[];
            branches: Branch[];
        }
        interface Operation {
            l?: string;
            r?: string;
            op: string;
            anchors?: Anchor;
        }
        interface Anchor {
            type: string;
            anchor_id: string;
            uris?: string[];
        }
    }
}
