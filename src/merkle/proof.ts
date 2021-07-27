import * as anchor from "../anchor";
import { Path, build, Tree } from "./merkle";
import https from "https";
import exp from "constants";

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
export function addPathToProof(
    proof: anchor.AnchorProof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): anchor.AnchorProof {
    switch (proof.format) {
        case "CHP_PATH":
            return addPathCHP(proof, hash, algorithm, path, label);
        case "CHP_PATH_SIGNED":
            return addPathCHP(proof, hash, algorithm, path, label);
        default:
            throw new Error("proof format not supported");
    }
}

function addPathCHP(
    proof: anchor.AnchorProof,
    hash: string,
    algorithm: string,
    path: Path[],
    label?: string
): anchor.AnchorProof {
    // Create new path branch
    let p: any = Object.assign({}, proof.data);
    let branch: any = {
        label: label,
        ops: [],
        branches: p.branches,
    };
    // Loop through each path element and create a CHP path.
    for (let i = 0; i < path.length; i++) {
        let value: any = {
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
export function validateHederaTransaction(
    txnId: string,
    expected: string,
    testnet: boolean
): Promise<{ valid: boolean; message?: string }> {
    return new Promise((res, rej) => {
        const options = {
            hostname: testnet ? "api.testnet.kabuto.sh" : "api.kabuto.sh",
            port: 443,
            path: "/v1/transaction/" + txnId,
            method: "GET",
        };
        const req = https.get(options, (r) => {
            let body = "";
            r.on("data", (d) => {
                body += d;
            });
            r.on("end", () => {
                let json = JSON.parse(body);
                // Validate the memo field against the hash.
                if (json.memo !== expected) {
                    res({
                        valid: false,
                        message: "expected hash and blockchain hash mismatch",
                    });
                } else {
                    res({ valid: true });
                }
            });
            r.on("error", (e) => {
                rej(e);
            });
        });
    });
}

export function validateEthereumTransaction(
    txnId: string,
    expected: string,
    testnet: boolean
): Promise<{ valid: boolean; message?: string }> {
    return new Promise((res, rej) => {
        const options = {
            hostname: testnet ? "api-rinkeby.etherscan.io" : "api.etherscan.io",
            port: 443,
            path:
                "/api?module=proxy&action=eth_getTransactionByHash&txhash=0x" +
                txnId +
                "&apikey=PPAP7QM5JTQZBD5BDNUD7VMS4RB3DJWTDV",
            method: "GET",
        };
        const req = https.get(options, (r) => {
            let body = "";
            r.on("data", (d) => {
                body += d;
            });
            r.on("end", () => {
                let json = JSON.parse(body);
                // Validate the txn input with expected
                if (json.result.input !== "0x" + expected) {
                    res({
                        valid: false,
                        message: "expected hash and blockchain hash mismatch",
                    });
                } else {
                    res({ valid: true });
                }
            });
            r.on("error", (e) => {
                rej(e);
            });
        });
    });
}
