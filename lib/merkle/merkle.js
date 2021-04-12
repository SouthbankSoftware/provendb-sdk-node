"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.Writer = exports.Tree = exports.newBuilder = exports.importTreeSync = exports.importTree = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
/**
 * Imports the given merkle file.
 * @param file the merkle file
 */
function importTree(file) {
    return new Tree(file.algorithm, file.data, file.proofs);
}
exports.importTree = importTree;
/**
 * Syncronously import a merkle tree from file at the given path.
 * @param path the path to the file.
 */
function importTreeSync(path) {
    var raw = fs_1.default.readFileSync(path);
    var file = JSON.parse(raw.toString());
    return importTree(file);
}
exports.importTreeSync = importTreeSync;
/**
 * Constructs a new builder.
 * @param algorithm the algorithm to use for hashing.
 */
function newBuilder(algorithm) {
    return new Builder(algorithm);
}
exports.newBuilder = newBuilder;
/**
 * Represents an entire Merkle tree.
 */
class Tree {
    /**
     * Constructs a new merkle tree.
     * @param algorithm the algorithm used to construct the tree
     * @param layers the merkle tree
     */
    constructor(algorithm, layers, proofs = []) {
        this.algorithm = algorithm;
        this.layers = layers;
        this.proofs = proofs;
        this.nodes = 0;
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
    exportSync(path) {
        var file = {
            algorithm: this.algorithm,
            proofs: this.proofs,
            data: this.layers,
        };
        fs_1.default.writeFileSync(path, JSON.stringify(file));
    }
    /**
     * Adds a confirmed proof to this tree.
     * @param proof the proof to add.
     */
    addProof(proof) {
        this.proofs.push(proof);
    }
    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm() {
        return this.algorithm;
    }
    getLeaf(key) {
        let leaf = null;
        this.layers[0].forEach(v => {
            let s = v.split(":");
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
    getLeaves() {
        let leaves = [];
        this.layers[0].forEach(v => {
            let s = v.split(":");
            leaves.push({ key: s[0], hash: s[1] });
        });
        return leaves;
    }
    /**
     * Retrieves all the nodes for the given level.
     * @param level the level to retrieve.
     */
    getLevel(level) {
        return this.layers[this.layers.length - 1 - level];
    }
    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(leaf, isHashed) {
        let hash = "";
        if (isHashed) {
            hash = leaf.toString();
        }
        else {
            hash = crypto_1.default.createHash(this.algorithm).update(leaf).digest("hex");
        }
        let path = [];
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
            }
            else {
                path.push({ r: layer[index + 1] });
            }
            index = (index / 2) | 0;
        }
        return path;
    }
    /**
     * Retrieves the proof, if any, for this tree.
     */
    getProofs() {
        return this.proofs;
    }
    /**
     * Retrieves the root hash of this tree.
     */
    getRoot() {
        return this.layers[this.layers.length - 1][0];
    }
    /**
     * Retreives the depth of this tree.
     */
    nDepth() {
        return this.layers.length - 1;
    }
    /**
     * Retrieves the number of leaves in this tree.
     */
    nLeaves() {
        return this.layers[0].length;
    }
    /**
     * Retrieves the number of levels in this tree.
     */
    nLevels() {
        return this.layers.length;
    }
    /**
     * Retrieves the number of nodes in this tree.
     */
    nNodes() {
        return this.nodes;
    }
    /**
     * Verifies this tree by recalculating the root from all the layers.
     */
    verify() {
        let current = [];
        let leaves = this.getLeaves();
        leaves.forEach(l => current.push(l.hash));
        let layer = [];
        // Loop through until we have a single node i.e. root hash.
        while (current.length > 1) {
            // Loop through the nodes with increments of 2 (pairs)
            for (let i = 0; i < current.length; i += 2) {
                // If we have an odd node, we promote it.
                if (i + 1 === current.length) {
                    layer.push(current[i]);
                }
                else {
                    let hash = crypto_1.default
                        .createHash(this.algorithm)
                        .update(Buffer.concat([
                        Buffer.from(current[i], "hex"),
                        Buffer.from(current[i + 1], "hex"),
                    ]))
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
exports.Tree = Tree;
/**
 *
 */
class Writer {
    constructor(algorithm, key, callback) {
        this.algorithm = algorithm;
        this.key = key;
        this.callback = callback;
        this.hasher = crypto_1.default.createHash(algorithm);
    }
    write(data) {
        this.hasher.update(data);
    }
    close() {
        this.callback(this.key, this.hasher.digest("hex"));
    }
}
exports.Writer = Writer;
/**
 * A builder to dynamically construct a new Merkle tree.
 */
class Builder {
    constructor(algorithm) {
        this.algorithm = algorithm;
        this.layers = [];
        this.layers.push([]);
    }
    /**
     * Adds a single leaf to the tree.
     * @param key the key
     * @param value the value
     */
    add(key, value) {
        this.layers[0].push(key + ":" + this.createHash(value));
        return this;
    }
    /**
     * Adds an array of leaves to the tree.
     * @param data the array of data to add.
     */
    addBatch(data) {
        data.forEach((d) => {
            this.add(d.key, d.value);
        });
        return this;
    }
    /**
     * Retrieves a writable data stream to stream data chunks. When using
     * this stream, the final hash is added once the close() method has been called.
     */
    writeStream(key) {
        return new Writer(this.algorithm, key, (hex) => {
            this.layers[0].push(hex);
        });
    }
    /**
     * Retrieves the algorithm used by this builder.
     */
    getAlgorithm() {
        return this.algorithm;
    }
    /**
     * Builds the merkle tree.
     */
    build() {
        // Construct from the leaves
        this._build(this.layers[0]);
        return new Tree(this.algorithm, this.layers);
    }
    _build(nodes) {
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
                }
                else {
                    var hash = this.createHash(Buffer.concat([
                        Buffer.from(nodes[i], "hex"),
                        Buffer.from(nodes[i + 1], "hex"),
                    ]));
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
    createHash(data) {
        return crypto_1.default.createHash(this.algorithm).update(data).digest("hex");
    }
}
exports.Builder = Builder;
//# sourceMappingURL=merkle.js.map