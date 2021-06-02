import crypto from "crypto";
import fs from "fs";
import { anchor } from "..";
import { addPathToProof } from "./proof";

/**
 * Leaf represents a single leaf in a merkle tree.
 */
export interface Leaf {
    // Key.
    key: string;
    // Hex encoded hash.
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
 * Converts string data to leaf.
 * @param data the data
 * @returns the leaf
 */
function toLeaf(data: string): Leaf {
    let s: string[] = data.split(":");
    return { key: s[0], value: s[1] };
}

/**
 * Converts leaf to string data.
 * @param leaf the leaf
 * @returns the string data
 */
function fromLeaf(leaf: Leaf): string {
    return leaf.key + ":" + leaf.value;
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
            leaf!.value,
            this.algorithm,
            this.getPath(leaf.key),
            label
        );
    }

    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm(): string {
        return this.algorithm;
    }

    /**
     * Retrieves a single leaf or null if it does not exist.
     * @param key the key of the leaf
     * @returns the leaf
     */
    getLeaf(key: string): Leaf | null {
        let leaf = null;
        this.layers[0].forEach((v) => {
            let l: Leaf = toLeaf(v);
            if (l.key === key) {
                leaf = l;
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
            leaves.push(toLeaf(v));
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
     * Retrieves all the levels in this tree.
     * @returns the levels
     */
    getLevels(): string[][] {
        return this.layers;
    }

    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(key: string): Path[] {
        // If only a single node, return empty path.
        if (this.nodes === 0) {
            return [];
        }
        let leaf = this.getLeaf(key);
        if (leaf === null) {
            return [];
        }
        let hash = leaf.value;
        let path: Path[] = [];
        // Find the leaf first
        let index = -1;
        for (let i = 0; i < this.layers[0].length; i++) {
            if (toLeaf(this.layers[0][i]).value === hash) {
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
                let l = layer[index - 1];
                if (l.includes(":")) {
                    l = l.split(":")[1];
                }
                path.push({ l: l });
            } else {
                // Check if this is an odd node on the end and skip
                if (index + 1 === layer.length) {
                    index = (index / 2) | 0;
                    continue;
                }
                let r = layer[index + 1];
                if (r.includes(":")) {
                    r = r.split(":")[1];
                }
                path.push({ r: r });
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
        // If a single node, return the value of the leaf/root.
        if (this.nodes === 0) {
            return toLeaf(this.layers[0][0]).value;
        }
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
        // If a single node/leaf/root, always return true. Nothing to calculate.
        if (this.nodes === 0) {
            return true;
        }
        let current: string[] = [];
        let leaves = this.getLeaves();
        leaves.forEach((l) => current.push(l.value));
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
 * A writer to generate a hash for large data that can be streamed in.
 */
export class Writer {
    private hasher: crypto.Hash;

    constructor(
        private algorithm: string,
        private key: string,
        private callback: (key: string, hex: string) => void
    ) {
        this.hasher = crypto.createHash(normalizeAlgorithm(algorithm));
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
        return new Writer(this.algorithm, key, (key: string, hex: string) => {
            this.layers[0].push(key + ":" + hex);
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
        // Perform some validation
        if (this.layers[0].length === 0) {
            throw new Error("a tree must contain at least 1 leaf");
        }
        // Build the tree only if there is more than one leaf.
        if (this.layers[0].length > 1) {
            this._build(this.layers[0]);
        }
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
                    let s: string = nodes[i];
                    if (nodes[i].includes(":")) {
                        s = nodes[i].split(":")[1];
                    }
                    this.layers[layerIndex].push(s);
                } else {
                    // If at least one node includes a key, split both.
                    let s1: string = nodes[i];
                    let s2: string = nodes[i + 1];
                    if (nodes[i].includes(":")) {
                        s1 = nodes[i].split(":")[1];
                        s2 = nodes[i + 1].split(":")[1];
                    }
                    var hash = this.createHash(
                        Buffer.concat([
                            Buffer.from(s1, "hex"),
                            Buffer.from(s2, "hex"),
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
