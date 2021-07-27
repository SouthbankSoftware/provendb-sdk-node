"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.Builder = exports.Writer = exports.Tree = exports.newBuilder = exports.importTreeSync = exports.importTree = exports.validateProofWithPath = exports.validateProofWithCredentials = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const __1 = require("..");
const proof_1 = require("./proof");
const chainpoint_parse_1 = require("chainpoint-parse");
function validateProofWithCredentials(credentials) {
    return function (options) {
        options.credentials = credentials;
    };
}
exports.validateProofWithCredentials = validateProofWithCredentials;
function validateProofWithPath(isPath) {
    return function (options) {
        options.isPath = isPath;
    };
}
exports.validateProofWithPath = validateProofWithPath;
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
 * Converts string data to leaf.
 * @param data the data
 * @returns the leaf
 */
function toLeaf(data) {
    let s = data.split(":");
    return { key: s[0], value: s[1] };
}
/**
 * Converts leaf to string data.
 * @param leaf the leaf
 * @returns the string data
 */
function fromLeaf(leaf) {
    return leaf.key + ":" + leaf.value;
}
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
     *
     * @param proof the proof to add the path to
     * @param key the key of the leaf to generate path from
     */
    addPathToProof(proof, key, label) {
        let leaf = this.getLeaf(key);
        if (leaf == null) {
            throw new Error("key '" + key + "' does not exist");
        }
        return proof_1.addPathToProof(proof, leaf.value, this.algorithm, this.getPath(leaf.key), label);
    }
    /**
     * Retreives the algorithm used to construct the tree.
     */
    getAlgorithm() {
        return this.algorithm;
    }
    /**
     * Retrieves a single leaf or null if it does not exist.
     * @param key the key of the leaf
     * @returns the leaf
     */
    getLeaf(key) {
        let leaf = null;
        this.layers[0].forEach((v) => {
            let l = toLeaf(v);
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
    getLeaves() {
        let leaves = [];
        this.layers[0].forEach((v) => {
            leaves.push(toLeaf(v));
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
     * Retrieves all the levels in this tree.
     * @returns the levels
     */
    getLevels() {
        return this.layers;
    }
    /**
     * Retrieves the path to the root from the leaf.
     * @param leaf the leaf
     */
    getPath(key) {
        // If only a single node, return empty path.
        if (this.nodes === 0) {
            return [];
        }
        let leaf = this.getLeaf(key);
        if (leaf === null) {
            return [];
        }
        let hash = leaf.value;
        let path = [];
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
            }
            else {
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
    getProofs() {
        return this.proofs;
    }
    /**
     * Retrieves the root hash of this tree.
     */
    getRoot() {
        // If a single node, return the value of the leaf/root.
        if (this.nodes === 0) {
            return toLeaf(this.layers[0][0]).value;
        }
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
     * Validates the proof by calculating a root hash from the leaves provided, checking it matches the proof's hash,
     * and validates the proof data with the expected blockchain hash.
     * @param proof the proof
     * @param opts the options
     * @returns true if valid, else false
     */
    validateProof(proof, ...opts) {
        return new Promise((res, rej) => {
            // Set the options
            let options = {
                credentials: "",
                isPath: false,
            };
            opts.forEach((o) => o(options));
            // Ensure proof is CHP and validate it.
            let format = __1.anchor.getProofFormat(proof.format);
            if (format === __1.anchor.Proof.Format.ETH_TRIE ||
                format === __1.anchor.Proof.Format.ETH_TRIE_SIGNED) {
                rej(new Error("proof format not supported"));
                return;
            }
            // Parse the chainpoint proof.
            let result;
            try {
                result = chainpoint_parse_1.parse(proof.data);
            }
            catch (e) {
                rej(e);
                return;
            }
            // Check that the proof hash data matches the generated tree hash
            if (proof.hash !== this.getRoot()) {
                res({
                    valid: false,
                    message: "proof hash and tree hash mismatch",
                });
                return;
            }
            // Get the expected blockchain hash
            let branch = result.branches[0];
            let exp;
            while (true) {
                if (branch.branches !== undefined) {
                    branch = branch.branches[0];
                }
                else {
                    exp = branch.anchors[0]["expected_value"];
                    break;
                }
            }
            switch (__1.anchor.getAnchorType(proof.anchorType)) {
                case __1.anchor.Anchor.Type.HEDERA:
                    proof_1.validateHederaTransaction(proof.metadata.txnId, exp, true)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                case __1.anchor.Anchor.Type.HEDERA_MAINNET:
                    proof_1.validateHederaTransaction(proof.metadata.txnId, exp, false)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                case __1.anchor.Anchor.Type.ETH:
                    proof_1.validateEthereumTransaction(proof.metadata.txnId, exp, true)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                case __1.anchor.Anchor.Type.ETH_MAINNET:
                    proof_1.validateEthereumTransaction(proof.metadata.txnId, exp, false)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                case __1.anchor.Anchor.Type.ETH_GOCHAIN:
                    proof_1.validateEthereumTransaction(proof.metadata.txnId, exp, false)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                case __1.anchor.Anchor.Type.ETH_ELASTOS:
                    proof_1.validateEthereumTransaction(proof.metadata.txnId, exp, false)
                        .then((r) => {
                        res(r);
                    })
                        .catch((e) => {
                        rej(e);
                    });
                    return;
                default:
                    rej(new Error("validation on '" +
                        proof.anchorType +
                        "' not supported"));
                    return;
            }
        });
    }
    /**
     * Verifies this tree by recalculating the root from all the layers.
     */
    verify() {
        // If a single node/leaf/root, always return true. Nothing to calculate.
        if (this.nodes === 0) {
            return true;
        }
        let leaves = [];
        this.getLeaves().forEach((l) => leaves.push(l.value));
        let layers = build(leaves, this.algorithm);
        return layers[layers.length - 1][0] === this.getRoot();
    }
}
exports.Tree = Tree;
/**
 * A writer to generate a hash for large data that can be streamed in.
 */
class Writer {
    constructor(algorithm, key, callback) {
        this.algorithm = algorithm;
        this.key = key;
        this.callback = callback;
        this.hasher = crypto_1.default.createHash(normalizeAlgorithm(algorithm));
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
        this.leaves = [];
        validateAlgorithm(algorithm);
    }
    /**
     * Adds a single leaf to the tree.
     * @param key the key
     * @param value the value
     */
    add(key, value) {
        this.leaves.push(key + ":" + createHash(value, this.algorithm));
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
        return new Writer(this.algorithm, key, (key, hex) => {
            this.leaves.push(key + ":" + hex);
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
        // Perform some validation
        if (this.leaves.length === 0) {
            throw new Error("a tree must contain at least 1 leaf");
        }
        // Build the tree only if there is more than one leaf.
        if (this.leaves.length > 1) {
            return new Tree(this.algorithm, build(this.leaves, this.algorithm));
        }
        return new Tree(this.algorithm, [this.leaves]);
    }
}
exports.Builder = Builder;
/**
 * Builds a merkle tree based on the initial leaf values.
 * @param data the leaves
 * @returns the built tree
 */
function build(leaves, algorithm) {
    let layers = [];
    // Push the leaf layer and assign first node layer
    layers.push(leaves);
    let nodes = leaves;
    // Loop through until we have a single node i.e. root hash.
    while (nodes.length > 1) {
        // Get the index of the next level and push an empty array.
        let layerIndex = layers.length;
        layers.push([]);
        // Loop through the nodes with increments of 2 (pairs)
        for (let i = 0; i < nodes.length; i += 2) {
            // If we have an odd node, we promote it.
            if (i + 1 === nodes.length) {
                let s = nodes[i];
                if (nodes[i].includes(":")) {
                    s = nodes[i].split(":")[1];
                }
                layers[layerIndex].push(s);
            }
            else {
                // If at least one node includes a key, split both.
                let s1 = nodes[i];
                let s2 = nodes[i + 1];
                if (nodes[i].includes(":")) {
                    s1 = nodes[i].split(":")[1];
                    s2 = nodes[i + 1].split(":")[1];
                }
                var hash = createHash(Buffer.concat([
                    Buffer.from(s1, "hex"),
                    Buffer.from(s2, "hex"),
                ]), algorithm);
                layers[layerIndex].push(hash);
            }
        }
        nodes = layers[layerIndex];
    }
    return layers;
}
exports.build = build;
/**
 * Creates a hash of the data.
 * @param data the data to hash.
 */
function createHash(data, algorithm) {
    return crypto_1.default
        .createHash(normalizeAlgorithm(algorithm))
        .update(data)
        .digest("hex");
}
function validateAlgorithm(algorithm) {
    switch (algorithm) {
        case "sha-256":
            break;
        case "sha-512":
            break;
        default:
            throw new Error("algorithm '" + algorithm + "' not supported");
    }
}
function normalizeAlgorithm(algorithm) {
    switch (algorithm) {
        case "sha-256":
            return "sha256";
        case "sha-512":
            return "sha512";
        default:
            throw new Error("algorithm '" + algorithm + "' not supported");
    }
}
//# sourceMappingURL=merkle.js.map