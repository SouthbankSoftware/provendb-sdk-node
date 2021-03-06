/// <reference types="node" />
import { anchor } from "..";
/**
 * Leaf represents a single leaf in a merkle tree.
 */
export interface Leaf {
    key: string;
    value: string;
}
/**
 * A file representation of a merkle tree.
 */
export interface File {
    /**
     * The algorithm used to construct the tree.
     */
    algorithm: string;
    /**
     * Any anchors for this tree.
     */
    proofs: anchor.AnchorProof[];
    /**
     * The tree data.
     */
    data: string[][];
}
/**
 * Path interface for a merkle path of left and right values.
 */
export interface Path {
    l?: string;
    r?: string;
}
interface ValidateProofOptions {
    credentials: string;
    isPath: boolean;
}
/**
 * Option type to pass to validateProof()
 */
declare type ValidateProofOption = (options: ValidateProofOptions) => void;
/**
 * Credentials to pass when validating against external blockchain APIs.
 * @param credentials the credentials
 * @returns the option
 */
export declare function validateProofWithCredentials(credentials: string): ValidateProofOption;
/**
 * Imports the given merkle file.
 * @param file the merkle file
 */
export declare function importTree(file: File): Tree;
/**
 * Syncronously import a merkle tree from file at the given path.
 * @param path the path to the file.
 */
export declare function importTreeSync(path: string): Tree;
/**
 * Constructs a new builder.
 * @param algorithm the algorithm to use for hashing.
 */
export declare function newBuilder(algorithm: string): Builder;
/**
 * Represents an entire Merkle tree.
 */
export declare class Tree {
    private algorithm;
    private layers;
    private proofs;
    private nodes;
    /**
     * Constructs a new merkle tree.
     * @param algorithm the algorithm used to construct the tree
     * @param layers the merkle tree
     */
    constructor(algorithm: string, layers: string[][], proofs?: anchor.AnchorProof[]);
    /**
     * Syncronously exports the merkle tree to file with the specified encoding.
     * @param path the path including filename to export to.
     */
    exportSync(path: string): void;
    /**
     * Adds a confirmed proof to this tree.
     * @param proof the proof to add.
     */
    addProof(proof: anchor.AnchorProof): void;
    /**
     *
     * @param proof the proof to add the path to
     * @param key the key of the leaf to generate path from
     */
    addPathToProof(proof: anchor.AnchorProof, key: string, label?: string): anchor.AnchorProof;
    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm(): string;
    /**
     * Retrieves a single leaf or null if it does not exist.
     * @param key the key of the leaf
     * @returns the leaf
     */
    getLeaf(key: string): Leaf | null;
    /**
     * Retrieves the leaves data.
     */
    getLeaves(): Leaf[];
    /**
     * Retrieves all the nodes for the given level.
     * @param level the level to retrieve.
     */
    getLevel(level: number): string[];
    /**
     * Retrieves all the levels in this tree.
     * @returns the levels
     */
    getLevels(): string[][];
    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(key: string): Path[];
    /**
     * Retrieves the proof, if any, for this tree.
     */
    getProofs(): any[];
    /**
     * Retrieves the root hash of this tree.
     */
    getRoot(): string;
    /**
     * Retreives the depth of this tree.
     */
    nDepth(): number;
    /**
     * Retrieves the number of leaves in this tree.
     */
    nLeaves(): number;
    /**
     * Retrieves the number of levels in this tree.
     */
    nLevels(): number;
    /**
     * Retrieves the number of nodes in this tree.
     */
    nNodes(): number;
    /**
     * Validates a proof against this tree by checking the tree's hash matches the proof hash,
     * and validates the proof receipt matches the expected blockchain hash.
     * @param proof the proof
     * @param opts the options
     * @returns true if valid, else false
     */
    validateProof(proof: anchor.AnchorProof, ...opts: ValidateProofOption[]): Promise<{
        valid: boolean;
        message?: string;
    }>;
    /**
     * Verifies this tree by recalculating the root from all the layers.
     */
    verify(): boolean;
}
/**
 * A writer to generate a hash for large data that can be streamed in.
 */
export declare class Writer {
    private algorithm;
    private key;
    private callback;
    private hasher;
    constructor(algorithm: string, key: string, callback: (key: string, hex: string) => void);
    write(data: Buffer): void;
    close(): void;
}
/**
 * A builder to dynamically construct a new Merkle tree.
 */
export declare class Builder {
    private algorithm;
    private leaves;
    constructor(algorithm: string);
    /**
     * Adds a single leaf to the tree.
     * @param key the key
     * @param value the value
     */
    add(key: string, value: Buffer): Builder;
    /**
     * Adds an array of leaves to the tree.
     * @param data the array of data to add.
     */
    addBatch(data: {
        key: string;
        value: Buffer;
    }[]): Builder;
    /**
     * Retrieves a writable data stream to stream data chunks. When using
     * this stream, the final hash is added once the close() method has been called.
     */
    writeStream(key: string): Writer;
    /**
     * Retrieves the algorithm used by this builder.
     */
    getAlgorithm(): string;
    /**
     * Builds the merkle tree.
     */
    build(): Tree;
}
/**
 * Builds a merkle tree based on the initial leaf values.
 * @param data the leaves
 * @returns the built tree
 */
export declare function build(leaves: string[], algorithm: string): string[][];
export {};
