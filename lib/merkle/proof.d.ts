import * as anchor from "../anchor";
import { Path } from "./merkle";
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
export declare function addPathToProof(proof: anchor.AnchorProof, hash: string, algorithm: string, path: Path[], label?: string): anchor.AnchorProof;
/**
 * Retrieves Hedera transaction directly from Kabuto.
 * @param id the transaction ID.
 * @param testnet whether the transaction is from the testnet
 */
export declare function validateHederaTransaction(txnId: string, expected: string, testnet: boolean): Promise<boolean>;
export declare function validateEthereumTransaction(txnId: string, expected: string, testnet: boolean): Promise<boolean>;
