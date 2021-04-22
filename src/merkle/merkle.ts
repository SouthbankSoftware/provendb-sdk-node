import crypto from "crypto";
import fs from "fs";
import { anchor } from "..";
import { addPathToProof } from "./proof";

export interface Leaf {
    // Key.
    key: string;
    // Hex encoded hash.
    hash: string;
}

/**
 * MerkleFile represents an exported file of a merkle tree.
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

export interface Path {
    l?: string;
    r?: string;
}

/**
 * Imports the given merkle file.
 * @param file the merkle file
 */
export function importTree(file: File): Tree {
    return new Tree(file.algorithm, file.data, file.proofs);
}

/**
 * Syncronously import a merkle tree from file at the given path.
 * @param path the path to the file.
 */
export function importTreeSync(path: string): Tree {
    var raw = fs.readFileSync(path);
    var file: File = JSON.parse(raw.toString());
    return importTree(file);
}

/**
 * Constructs a new builder.
 * @param algorithm the algorithm to use for hashing.
 */
export function newBuilder(algorithm: string): Builder {
    return new Builder(algorithm);
}

/**
 * Represents an entire Merkle tree.
 */
export class Tree {
    private nodes = 0;

    /**
     * Constructs a new merkle tree.
     * @param algorithm the algorithm used to construct the tree
     * @param layers the merkle tree
     */
    constructor(
        private algorithm: string,
        private layers: string[][],
        private proofs: anchor.AnchorProof[] = []
    ) {
        this.algorithm = algorithm;
        this.layers = layers;
        for (let i = 1; i < layers.length; i++) {
            this.nodes += layers[i].length;
        }
    }

    /**
     * Syncronously exports the merkle tree to file with the specified encoding.
     * @param path the path including filename to export to.
     */
    exportSync(path: string) {
        var file: File = {
            algorithm: this.algorithm,
            proofs: this.proofs,
            data: this.layers,
        };
        fs.writeFileSync(path, JSON.stringify(file));
    }

    /**
     * Adds a confirmed proof to this tree.
     * @param proof the proof to add.
     */
    addProof(proof: anchor.AnchorProof) {
        this.proofs.push(proof);
    }

    /**
     *
     * @param proof the proof to add the path to
     * @param key the key of the leaf to generate path from
     */
    addPathToProof(
        proof: anchor.AnchorProof,
        key: string,
        label?: string
    ): anchor.AnchorProof {
        let leaf = this.getLeaf(key);
        if (leaf == null) {
            throw new Error("key '" + key + "' does not exist");
        }
        return addPathToProof(
            proof,
            leaf!.hash,
            this.algorithm,
            this.getPath(leaf),
            label
        );
    }

    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm(): string {
        return this.algorithm;
    }

    getLeaf(key: string): Leaf | null {
        let leaf = null;
        this.layers[0].forEach((v) => {
            let s: string[] = v.split(":");
            if (s[0] === key) {
                leaf = { key: s[0], hash: s[1] };
                return;
            }
        });
        return leaf;
    }

    /**
     * Retrieves the leaves data.
     */
    getLeaves(): Leaf[] {
        let leaves: Leaf[] = [];
        this.layers[0].forEach((v) => {
            let s: string[] = v.split(":");
            leaves.push({ key: s[0], hash: s[1] });
        });
        return leaves;
    }

    /**
     * Retrieves all the nodes for the given level.
     * @param level the level to retrieve.
     */
    getLevel(level: number): string[] {
        return this.layers[this.layers.length - 1 - level];
    }

    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(leaf: Leaf): Path[] {
        let hash = leaf.hash;
        let path: Path[] = [];
        // Find the leaf first
        let index = -1;
        for (let i = 0; i < this.layers[0].length; i++) {
            if (this.layers[0][i] === hash) {
                index = i;
            }
        }

        if (index == -1) {
            return [];
        }

        // Loop through each layer and get the index pair. Skip the root layer.
        for (let i = 0; i < this.layers.length - 1; i++) {
            let layer = this.layers[i];
            let isRight = index % 2 !== 0;
            if (isRight) {
                path.push({ l: layer[index - 1] });
            } else {
                path.push({ r: layer[index + 1] });
            }
            index = (index / 2) | 0;
        }
        return path;
    }

    /**
     * Retrieves the proof, if any, for this tree.
     */
    getProofs(): any[] {
        return this.proofs;
    }

    /**
     * Retrieves the root hash of this tree.
     */
    getRoot(): string {
        return this.layers[this.layers.length - 1][0];
    }

    /**
     * Retreives the depth of this tree.
     */
    nDepth(): number {
        return this.layers.length - 1;
    }

    /**
     * Retrieves the number of leaves in this tree.
     */
    nLeaves(): number {
        return this.layers[0].length;
    }

    /**
     * Retrieves the number of levels in this tree.
     */
    nLevels(): number {
        return this.layers.length;
    }

    /**
     * Retrieves the number of nodes in this tree.
     */
    nNodes(): number {
        return this.nodes;
    }

    /**
     * Verifies this tree by recalculating the root from all the layers.
     */
    verify(): boolean {
        let current: string[] = [];
        let leaves = this.getLeaves();
        leaves.forEach((l) => current.push(l.hash));
        let layer = [];
        // Loop through until we have a single node i.e. root hash.
        while (current.length > 1) {
            // Loop through the nodes with increments of 2 (pairs)
            for (let i = 0; i < current.length; i += 2) {
                // If we have an odd node, we promote it.
                if (i + 1 === current.length) {
                    layer.push(current[i]);
                } else {
                    let hash = crypto
                        .createHash(this.algorithm)
                        .update(
                            Buffer.concat([
                                Buffer.from(current[i], "hex"),
                                Buffer.from(current[i + 1], "hex"),
                            ])
                        )
                        .digest("hex");
                    layer.push(hash);
                }
            }
            current = layer;
            layer = [];
        }
        return current[0] === this.getRoot();
    }
}

/**
 *
 */
export class Writer {
    private hasher: crypto.Hash;

    constructor(
        private algorithm: string,
        private key: string,
        private callback: (key: string, hex: string) => void
    ) {
        this.hasher = crypto.createHash(algorithm);
    }

    write(data: Buffer) {
        this.hasher.update(data);
    }

    close() {
        this.callback(this.key, this.hasher.digest("hex"));
    }
}

/**
 * A builder to dynamically construct a new Merkle tree.
 */
export class Builder {
    private layers: string[][] = [];

    constructor(private algorithm: string) {
        validateAlgorithm(algorithm);
        this.layers.push([]);
    }
    /**
     * Adds a single leaf to the tree.
     * @param key the key
     * @param value the value
     */
    add(key: string, value: Buffer): Builder {
        this.layers[0].push(key + ":" + this.createHash(value));
        return this;
    }

    /**
     * Adds an array of leaves to the tree.
     * @param data the array of data to add.
     */
    addBatch(data: { key: string; value: Buffer }[]): Builder {
        data.forEach((d) => {
            this.add(d.key, d.value);
        });
        return this;
    }

    /**
     * Retrieves a writable data stream to stream data chunks. When using
     * this stream, the final hash is added once the close() method has been called.
     */
    writeStream(key: string): Writer {
        return new Writer(this.algorithm, key, (hex: string) => {
            this.layers[0].push(hex);
        });
    }

    /**
     * Retrieves the algorithm used by this builder.
     */
    getAlgorithm(): string {
        return this.algorithm;
    }

    /**
     * Builds the merkle tree.
     */
    build(): Tree {
        // Construct from the leaves
        this._build(this.layers[0]);
        return new Tree(this.algorithm, this.layers);
    }

    private _build(nodes: string[]) {
        // Loop through until we have a single node i.e. root hash.
        while (nodes.length > 1) {
            // Get the index of the next level and push an empty array.
            let layerIndex = this.layers.length;
            this.layers.push([]);
            // Loop through the nodes with increments of 2 (pairs)
            for (let i = 0; i < nodes.length; i += 2) {
                // If we have an odd node, we promote it.
                if (i + 1 === nodes.length) {
                    this.layers[layerIndex].push(nodes[i]);
                } else {
                    var hash = this.createHash(
                        Buffer.concat([
                            Buffer.from(nodes[i], "hex"),
                            Buffer.from(nodes[i + 1], "hex"),
                        ])
                    );
                    this.layers[layerIndex].push(hash);
                }
            }
            nodes = this.layers[layerIndex];
        }
    }

    /**
     * Creates a hash of the data.
     * @param data the data to hash.
     */
    private createHash(data: Buffer): string {
        return crypto
            .createHash(normalizeAlgorithm(this.algorithm))
            .update(data)
            .digest("hex");
    }
}

function validateAlgorithm(algorithm: string) {
    switch (algorithm) {
        case "sha-256":
            break;
        case "sha-512":
            break;
        default:
            throw new Error("algorithm '" + algorithm + "' not supported");
    }
}

function normalizeAlgorithm(algorithm: string) {
    switch (algorithm) {
        case "sha-256":
            return "sha256";
        case "sha-512":
            return "sha512";
        default:
            throw new Error("algorithm '" + algorithm + "' not supported");
    }
}
