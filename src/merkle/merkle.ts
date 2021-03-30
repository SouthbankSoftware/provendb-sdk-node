import crypto from "crypto";
import fs from "fs";


/**
 * Representation of a confirmed and complete proof.
 */
 export interface Proof {
    id: string;
    // Metadata about the transaction.
    metadata: Map<string,any>;
    // The proof data (receipt).
    data: any;
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
    proofs: Proof[];

    /**
     * The tree data.
     */
    data: string[][];
}

export interface Path {
    l?: string;
    r?: string;
    op?: string;
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
        private proofs: Proof[] = []
    ) {
        this.algorithm = algorithm;
        this.layers = layers;
        for (let i = 1; i < layers.length; i++) {
            this.nodes += layers[i].length;
        }
    }

    /**
     * Imports the given merkle file.
     * @param file the merkle file
     */
    static import(file: File): Tree {
        return new Tree(file.algorithm, file.data, file.proofs);
    }

    /**
     * Syncronously import a merkle tree from file at the given path.
     * @param path the path to the file.
     */
    static importSync(path: string): Tree {
        var raw = fs.readFileSync(path);
        var file: File = JSON.parse(raw.toString());
        return Tree.import(file);
    }

    /**
     * Constructs a new builder.
     * @param algorithm the algorithm to use for hashing.
     */
    static builder(algorithm: string): Builder {
        return new Builder(algorithm);
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
    addProof(id: string, proof: Proof) {
        this.proofs.push(proof);
    }

    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm(): string {
        return this.algorithm;
    }

    /**
     * Retrieves the leaves data.
     */
    getLeaves(): string[] {
        return this.layers[0];
    }

    /**
     * Retrieves all the nodes for the given level.
     * @param level the level to retrieve.
     */
    getLevel(level: number): string[] {
        return this.layers[this.layers.length - 1 - level];
    }

    /**
     * Retrieves the path from the leaf to the root and adds this as a path to an
     * existing proof.
     * @param leaf the leaf to get the path of
     * @param isHashed whether the leaf is already hashed
     * @param proof the proof to add this path to
     */
    getPathWithProof(
        leaf: Buffer,
        isHashed: boolean,
        proof: Proof,
        label: string
    ): Proof {
        switch (proof.format) {
            // This is a V3 proof.
            case proto.Proof.Format.CHP_PATH: {
                let v3: V3.Proof = V3.parse(proof.data);
                proof.data = this.getChainpointV3Path(leaf, isHashed, v3, label);
                return proof;
            }
            default:
                throw new Error("format not supported");
        }
    }

    /**
     * Retrieves a Chainpoint V3 proof with path and adds it to an existing proof.
     * @param leaf the leaf to get path for.
     * @param isHashed whether the leaf is already hashed.
     * @param proof the proof.
     */
    private getChainpointV3Path(
        leaf: Buffer,
        isHashed: boolean,
        proof: V3.Proof,
        label: string
    ): V3.Proof {
        let path: any[] = this.getPath(leaf, isHashed);
        // If no path, throw error
        if (path.length === 0) {
            throw new Error("no path exists");
        }
        // Create new path branch
        let branch: V3.Branch = {
            label: label,
            ops: [],
            branches: proof.branches,
        };
        // Loop through each path element and create a CHP path.
        for (let i = 0; i < path.length; i++) {
            let value: V3.Operation = {
                l: path[i].l,
                r: path[i].r,
            };
            branch.ops.push(value);
            branch.ops.push({ op: "sha-256" });
        }
        // Add the new branch with nested branches.
        proof.hash = leaf.toString();
        proof.branches = [branch];
        return proof;
    }

    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(leaf: Buffer, isHashed: boolean): Path[] {
        let hash = "";
        if (isHashed) {
            hash = leaf.toString();
        } else {
            hash = crypto.createHash(this.algorithm).update(leaf).digest("hex");
        }
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
            let isRight = (index % 2) !== 0
            if (isRight) {
                path.push({ l: layer[index - 1] });
            } else {
                path.push({ r: layer[index + 1] });
            }
            index = index / 2 | 0;
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
        let current = this.layers[0];
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
        private callback: (hex: string) => void
    ) {
        this.hasher = crypto.createHash(algorithm);
    }

    write(data: Buffer) {
        this.hasher.update(data);
    }

    close() {
        this.callback(this.hasher.digest("hex"));
    }
}

/**
 * A builder to dynamically construct a new Merkle tree.
 */
export class Builder {
    private layers: string[][] = [];

    constructor(private algorithm: string) {
        this.layers.push([]);
    }

    /**
     * Adds a single leaf to the tree.
     * @param data the data to add.
     */
    add(data: Buffer): Builder {
        this.layers[0].push(this.createHash(data));
        return this;
    }

    /**
     * Adds an array of leaves to the tree.
     * @param data the array of data to add.
     */
    addBatch(data: Buffer[]): Builder {
        data.forEach((d) => {
            this.add(d);
        });
        return this;
    }

    /**
     * Retrieves a writable data stream to stream data chunks. When using
     * this stream, the final hash is added once the close() method has been called.
     */
    writeStream(): Writer {
        return new Writer(this.algorithm, (hex: string) => {
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
        return crypto.createHash(this.algorithm).update(data).digest("hex");
    }
}
