"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEthereumTransaction = exports.validateHederaTransaction = exports.addPathToProof = void 0;
const https_1 = __importDefault(require("https"));
/**
 * Adds a merkle path to an existing proof.
 *
 * @param proof the proof to add the path to
 * @param hash the hash the path begins at
 * @param algorithm the algorithm used to construct the path
 * @param path the path to add
 * @param label the label (description)
 * @returns the updated proof
 */
function addPathToProof(proof, hash, algorithm, path, label) {
    switch (proof.format) {
        case "CHP_PATH":
            return addPathCHP(proof, hash, algorithm, path, label);
        case "CHP_PATH_SIGNED":
            return addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}
exports.addPathToProof = addPathToProof;
function addPathCHP(proof, hash, algorithm, path, label) {
    // Create new path branch
    let p = Object.assign({}, proof.data);
    let branch = {
        label: label,
        ops: [],
        branches: p.branches,
    };
    // Loop through each path element and create a CHP path.
    for (let i = 0; i < path.length; i++) {
        let value = {
            l: path[i].l,
            r: path[i].r,
        };
        branch.ops.push(value);
        branch.ops.push({ op: algorithm });
    }
    // Add the new branch with nested branches.
    p.hash = hash;
    p.branches = [branch];
    return {
        id: proof.id,
        anchorType: proof.anchorType,
        batchId: proof.batchId,
        status: proof.status,
        hash: hash,
        format: proof.format,
        metadata: proof.metadata,
        data: p,
    };
}
/**
 * Retrieves Hedera transaction directly from Kabuto.
 * @param id the transaction ID.
 * @param testnet whether the transaction is from the testnet
 */
function validateHederaTransaction(txnId, expected, testnet) {
    return new Promise((res, rej) => {
        const options = {
            hostname: testnet ? "api.testnet.kabuto.sh" : "api.kabuto.sh",
            port: 443,
            path: "/v1/transaction/" + txnId,
            method: "GET",
        };
        const req = https_1.default.get(options, (r) => {
            let body = "";
            r.on("data", (d) => {
                body += d;
            });
            r.on("end", () => {
                let json = JSON.parse(body);
                // Validate the memo field against the hash.
                res(json.memo === expected);
            });
            r.on("error", (e) => {
                rej(e);
            });
        });
    });
}
exports.validateHederaTransaction = validateHederaTransaction;
function validateEthereumTransaction(txnId, expected, testnet) {
    return new Promise((res, rej) => {
        const options = {
            hostname: testnet ? "api-rinkeby.etherscan.io" : "api.etherscan.io",
            port: 443,
            path: "/api?module=proxy&action=eth_getTransactionByHash&txhash=0x" +
                txnId +
                "&apikey=PPAP7QM5JTQZBD5BDNUD7VMS4RB3DJWTDV",
            method: "GET",
        };
        const req = https_1.default.get(options, (r) => {
            let body = "";
            r.on("data", (d) => {
                body += d;
            });
            r.on("end", () => {
                let json = JSON.parse(body);
                // Validate the txn input with expected
                res(json.result.input === "0x" + expected);
            });
            r.on("error", (e) => {
                rej(e);
            });
        });
    });
}
exports.validateEthereumTransaction = validateEthereumTransaction;
//# sourceMappingURL=proof.js.map