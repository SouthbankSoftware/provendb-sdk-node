import { newBuilder, importTree, Path, File } from "../src/merkle/merkle";
// The leaves (a, b, c, ... p) are hashed using a utf8 encoded string, and all hashes following are hashed
// using hex encoded strings. There should be enough data here to create your test cases.
const a = "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
const b = "3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d";
const c = "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6";
const d = "18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4";
const e = "3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea";
const f = "252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111";
const g = "cd0aa9856147b6c5b4ff2b7dfee5da20aa38253099ef1b4a64aced233c9afe29";
const h = "aaa9402664f1a41f40ebbc52c9993eb66aeb366602958fdfaa283b71e64db123";
const i = "de7d1b721a1e0632b7cf04edf5032c8ecffa9f9a08492152b926f1a5a7e765d7";
const j = "189f40034be7a199f1fa9891668ee3ab6049f82d38c68be70f596eab2e1857b7";
const k = "8254c329a92850f6d539dd376f4816ee2764517da5e0235514af433164480d7a";
const l = "acac86c0e609ca906f632b0e2dacccb2b77d22b0621f20ebece1a4835b93f6f0";
const m = "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a";
const n = "1b16b1df538ba12dc3f97edbb85caa7050d46c148134290feba80f8236c83db9";
const o = "65c74c15a686187bb6bbf9958f494fc6b80068034a659a9ad44991b08c58f2d2";
const p = "148de9c5a7a44d19e56cd9ae1a554bf67847afb0c58f6e12fa29ac7ddfca9940";

const ab = "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a";
const cd = "bffe0b34dba16bc6fac17c08bac55d676cded5a4ade41fe2c9924a5dde8f3e5b";
const ef = "04fa33f8b4bd3db545fa04cdd51b462509f611797c7bfe5c944ee2bb3b2ed908";
const gh = "140257c1540113794d2ae3394879e586ca5caebca19663ff87417892cf36fd23";
const ij = "cf1970792b0aa5816da207cd936e21f594f4e9c68cb01ca97d843047e3107958";
const kl = "6c192582bc0f32bf1ba5833b200db8795b8fbe49228f9a73c09687a777dfca61";
const mn = "94ffc897da3f6a1098eb7b573721291eb9c58154e3fbd10e525c27baa0108bae";
const op = "91756679180e8130ee47a9cb4713261e4e3189d1aef40087dce9c393e38e84fd";

const mno = "7b0fbd42a983b6214192e1531e68881716c87c4672cd17799779b635e685a273";

const abcd = "14ede5e8e97ad9372327728f5099b95604a39593cac3bd38a343ad76205213e7";
const efgh = "8e2c530a100033894555cde1c7d4e36f7c6e553ee3914022ec7a13e1196baed2";
const ijkl = "9ed3e37faea35ec0ddf7bd4e7ea9e8e47ce83dfa84e13c8874646d83079c72aa";
const mnop = "bab7598e438c316f64a14876fb50be7177adf9eaaf257eabd60b84662dea09f8";

const abcdef =
    "1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2";

const ijklmno =
    "6eeb6ef56df316c559cc627dd31358ce494fed3db575668ad93e4e4102d5025e";

const abcdefgh =
    "bd7c8a900be9b67ba7df5c78a652a8474aedd78adb5083e80e49d9479138a23f";
const ijklmnop =
    "5a2419accdde223b023d7bd53f4c58758207598b227c31e92c4120593c9e4ca3";

const abcdefghijklmno =
    "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d";

const abcdefghijklmnop =
    "2eb4698fb52b0cd41d51e50f1878c2c23fdba3be61c73da456a8c40aea13003c";

const message =
    "this is a message designed to be used as input to the builder's Writer() method";
const messageHashed =
    "2eedeb6c4d47f67831ffb0df5726f37d4137351bb39a88275cd5c1b7e0f024a4";

const abcdefghijklmnop_messageHashed =
    "d5d55c1dba8af00399a878abc75c21d328caa1815cb7fbaa5ad106e6eb9c0fea";

const HEDERA_MAINNET_PROOF = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:JSDsynnzHWw1HY6Qr_YlU",
    "anchorType": "HEDERA_MAINNET",
    "format": "CHP_PATH",
    "batchId": "JSDsynnzHWw1HY6Qr_YlU",
    "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
    "status": "CONFIRMED",
    "metadata": {
        "txnId": "d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
        "txnUri": "https://app.dragonglass.me/hedera/search?q=d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
        "blockTime": 1627338310,
        "blockTimeNano": 914105000,
        "validStart": "2021-07-26T22:25:00.069025724Z",
        "operator": "0.0.44034",
        "transactionFee": 53631,
        "confirmedByMirror": true
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-26T22:25:09Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-26T22:25:09Z",
        "branches": [
            {
                "label": "pdb_hedera_mainnet_anchor_branch",
                "ops": [
                    {
                        "anchors": [
                            {
                                "type": "cal",
                                "anchor_id": "d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
                                "uris": [
                                    "https://anchor.proofable.io/verify/hedera_mainnet/d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
    
const HEDERA_MAINNET_PROOF_PATH = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:JSDsynnzHWw1HY6Qr_YlU",
    "anchorType": "HEDERA_MAINNET",
    "batchId": "JSDsynnzHWw1HY6Qr_YlU",
    "status": "CONFIRMED",
    "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
    "format": "CHP_PATH",
    "metadata": {
        "txnId": "d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
        "txnUri": "https://app.dragonglass.me/hedera/search?q=d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
        "blockTime": 1627338310,
        "blockTimeNano": 914105000,
        "validStart": "2021-07-26T22:25:00.069025724Z",
        "operator": "0.0.44034",
        "transactionFee": 53631,
        "confirmedByMirror": true
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-26T22:25:09Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-26T22:25:09Z",
        "branches": [
            {
                "label": "c_path",
                "ops": [
                    {
                        "r": "18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "l": "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "8e2c530a100033894555cde1c7d4e36f7c6e553ee3914022ec7a13e1196baed2"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "6eeb6ef56df316c559cc627dd31358ce494fed3db575668ad93e4e4102d5025e"
                    },
                    {
                        "op": "sha-256"
                    }
                ],
                "branches": [
                    {
                        "label": "pdb_hedera_mainnet_anchor_branch",
                        "ops": [
                            {
                                "anchors": [
                                    {
                                        "type": "cal",
                                        "anchor_id": "d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44",
                                        "uris": [
                                            "https://anchor.proofable.io/verify/hedera_mainnet/d273f4b9d4c415475f9e7676d36767aa74467c4b21df2e8464962901e5ebd2c2776048525cf288274e3bf81a64730d44"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

const HEDERA_TESTNET_PROOF = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:WTiZz6rj16oQtCE8icszp",
    "anchorType": "HEDERA",
    "format": "CHP_PATH",
    "batchId": "WTiZz6rj16oQtCE8icszp",
    "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
    "status": "CONFIRMED",
    "metadata": {
        "txnId": "c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
        "txnUri": "https://testnet.dragonglass.me/hedera/search?q=c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
        "blockTime": 1627352476,
        "blockTimeNano": 676183000,
        "validStart": "2021-07-27T02:21:06.383057692Z",
        "operator": "0.0.32921",
        "transactionFee": 53979,
        "confirmedByMirror": true
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-27T02:21:16Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-27T02:21:16Z",
        "branches": [
            {
                "label": "pdb_hedera_anchor_branch",
                "ops": [
                    {
                        "anchors": [
                            {
                                "type": "cal",
                                "anchor_id": "c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
                                "uris": [
                                    "https://anchor.proofable.io/verify/hedera/c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

const HEDERA_TESTNET_PROOF_PATH = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:WTiZz6rj16oQtCE8icszp",
    "anchorType": "HEDERA",
    "batchId": "WTiZz6rj16oQtCE8icszp",
    "status": "CONFIRMED",
    "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
    "format": "CHP_PATH",
    "metadata": {
        "txnId": "c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
        "txnUri": "https://testnet.dragonglass.me/hedera/search?q=c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
        "blockTime": 1627352476,
        "blockTimeNano": 676183000,
        "validStart": "2021-07-27T02:21:06.383057692Z",
        "operator": "0.0.32921",
        "transactionFee": 53979,
        "confirmedByMirror": true
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-27T02:21:16Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-27T02:21:16Z",
        "branches": [
            {
                "label": "c_path",
                "ops": [
                    {
                        "r": "18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "l": "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "8e2c530a100033894555cde1c7d4e36f7c6e553ee3914022ec7a13e1196baed2"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "6eeb6ef56df316c559cc627dd31358ce494fed3db575668ad93e4e4102d5025e"
                    },
                    {
                        "op": "sha-256"
                    }
                ],
                "branches": [
                    {
                        "label": "pdb_hedera_anchor_branch",
                        "ops": [
                            {
                                "anchors": [
                                    {
                                        "type": "cal",
                                        "anchor_id": "c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db",
                                        "uris": [
                                            "https://anchor.proofable.io/verify/hedera/c488de55751e7a296e35dbafdbc33fbf033ccbb20a3e098a1d956b8aa0744c13f291b1e5c903f1b27bbda0fb90c628db"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

const ETHEREUM_TESTNET_PROOF = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:H64v_x7JDByPVWv7pROsD",
    "anchorType": "ETH",
    "format": "CHP_PATH",
    "batchId": "H64v_x7JDByPVWv7pROsD",
    "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
    "status": "CONFIRMED",
    "metadata": {
        "txnId": "5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
        "txnUri": "https://rinkeby.etherscan.io/tx/0x5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
        "blockTime": 1627353185,
        "blockNumber": 9007626,
        "endpoint": "https://rinkeby.infura.io/v3/ba25a62205f24e5bb74d4f9738910a83",
        "gasUsed": 21512,
        "gasPrice": 1000000010
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-27T02:32:53Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-27T02:32:53Z",
        "branches": [
            {
                "label": "pdb_eth_anchor_branch",
                "ops": [
                    {
                        "anchors": [
                            {
                                "type": "cal",
                                "anchor_id": "5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
                                "uris": [
                                    "https://anchor.proofable.io/verify/eth/5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

const ETHEREUM_TESTNET_PROOF_PATH = {
    "id": "5486677cd239f0bde3a0bf517fef8de3cc04e75731be77642b30b6671833c76d:H64v_x7JDByPVWv7pROsD",
    "anchorType": "ETH",
    "batchId": "H64v_x7JDByPVWv7pROsD",
    "status": "CONFIRMED",
    "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
    "format": "CHP_PATH",
    "metadata": {
        "txnId": "5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
        "txnUri": "https://rinkeby.etherscan.io/tx/0x5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
        "blockTime": 1627353185,
        "blockNumber": 9007626,
        "endpoint": "https://rinkeby.infura.io/v3/ba25a62205f24e5bb74d4f9738910a83",
        "gasUsed": 21512,
        "gasPrice": 1000000010
    },
    "data": {
        "@context": "https://w3id.org/chainpoint/v3",
        "type": "Chainpoint",
        "hash": "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
        "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_node_at": "2021-07-27T02:32:53Z",
        "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
        "hash_submitted_core_at": "2021-07-27T02:32:53Z",
        "branches": [
            {
                "label": "c_path",
                "ops": [
                    {
                        "r": "18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "l": "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "8e2c530a100033894555cde1c7d4e36f7c6e553ee3914022ec7a13e1196baed2"
                    },
                    {
                        "op": "sha-256"
                    },
                    {
                        "r": "6eeb6ef56df316c559cc627dd31358ce494fed3db575668ad93e4e4102d5025e"
                    },
                    {
                        "op": "sha-256"
                    }
                ],
                "branches": [
                    {
                        "label": "pdb_eth_anchor_branch",
                        "ops": [
                            {
                                "anchors": [
                                    {
                                        "type": "cal",
                                        "anchor_id": "5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798",
                                        "uris": [
                                            "https://anchor.proofable.io/verify/eth/5f42969e69606740bda1da9ec13091b96ea39e22b72a8bcb972797969fc2b798"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

describe("Test Tree", () => {
    it("Should be a valid single value tree", () => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        let tree = builder.build();

        expect(tree.getLeaf("a")).toEqual({key: "a", value: a});
        expect(tree.getRoot()).toEqual(a);
        expect(tree.getLeaves()).toEqual([{key: "a", value: a}])
        expect(tree.getPath("a")).toEqual([]);
        expect(tree.getLevels()).toEqual([["a:"+a]])
        expect(tree.verify()).toBeTruthy();
        expect(tree.nDepth()).toEqual(0);
        expect(tree.nLeaves()).toEqual(1);
        expect(tree.nLevels()).toEqual(1);
        expect(tree.nNodes()).toEqual(0);
    });

    it("Should import", () => {
        let file: any = {}
        Object.assign(file, JSON.parse('{"algorithm":"sha-256","proofs":[{"id":"7490851498225877e49242413ae9a8f532896b29c25a914d8e26d53589a22c83:XEKrNVaTCQs4TAWtaZ5mA","anchorType":"HEDERA","format":"CHP_PATH","batchId":"XEKrNVaTCQs4TAWtaZ5mA","hash":"7490851498225877e49242413ae9a8f532896b29c25a914d8e26d53589a22c83","status":"CONFIRMED","metadata":{"txnId":"91ae3a5b71fc9dcc7db2b94791d366546059503b61b331b953ffbb401e194bd1d0e5f5c1842a83382a2936798b106f69","txnUri":"https://explorer.kabuto.sh/testnet/transaction/91ae3a5b71fc9dcc7db2b94791d366546059503b61b331b953ffbb401e194bd1d0e5f5c1842a83382a2936798b106f69","blockTime":1621900778,"blockTimeNano":804949000,"validStart":"2021-05-24T23:59:26.166767126Z","operator":"0.0.32921","transactionFee":39738,"confirmedByMirror":true},"data":{"@context":"https://w3id.org/chainpoint/v3","type":"Chainpoint","hash":"7490851498225877e49242413ae9a8f532896b29c25a914d8e26d53589a22c83","hash_id_node":"da023c5c-c895-11e9-a32f-2a2ae2dbcce4","hash_submitted_node_at":"2021-05-24T23:59:38Z","hash_id_core":"da023c5c-c895-11e9-a32f-2a2ae2dbcce4","hash_submitted_core_at":"2021-05-24T23:59:38Z","branches":[{"label":"pdb_hedera_anchor_branch","ops":[{"anchors":[{"type":"cal","anchor_id":"91ae3a5b71fc9dcc7db2b94791d366546059503b61b331b953ffbb401e194bd1d0e5f5c1842a83382a2936798b106f69","uris":["https://anchor.dev.proofable.io/verify/hedera/91ae3a5b71fc9dcc7db2b94791d366546059503b61b331b953ffbb401e194bd1d0e5f5c1842a83382a2936798b106f69"]}]}]}]}}],"data":[["AAAR44AAMAAAAgzAAA:305f70ab88c19c5ba8d20851ac58ad50fb8812f8e3d839826e59e9a7c9c429e9","AAAR44AAMAAAAgzAAB:cf458618fa15ac9a72fcd296f5e102f15eff63fe40d256f20f756097475f9ac7"],["7490851498225877e49242413ae9a8f532896b29c25a914d8e26d53589a22c83"]]}'))
        importTree(file as File)
    });

    it("Should build correct tree (even leaves)", () => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        builder.add("b", Buffer.from("b"));
        builder.add("c", Buffer.from("c"));
        builder.add("d", Buffer.from("d"));
        builder.add("e", Buffer.from("e"));
        builder.add("f", Buffer.from("f"));
        builder.add("g", Buffer.from("g"));
        builder.add("h", Buffer.from("h"));

        builder.addBatch([
            { key: "i", value: Buffer.from("i") },
            { key: "j", value: Buffer.from("j") },
            { key: "k", value: Buffer.from("k") },
            { key: "l", value: Buffer.from("l") },
            { key: "m", value: Buffer.from("m") },
            { key: "n", value: Buffer.from("n") },
            { key: "o", value: Buffer.from("o") },
            { key: "p", value: Buffer.from("p") },
        ]);

        let tree = builder.build();

        let levels = [
            ["a:"+a, "b:"+b,"c:"+c,"d:"+d,"e:"+e,"f:"+f,"g:"+g,"h:"+h,"i:"+i,"j:"+j,"k:"+k,"l:"+l,"m:"+m,"n:"+n,"o:"+o,"p:"+p],
            [ab, cd, ef, gh, ij, kl, mn, op],
            [abcd, efgh, ijkl, mnop],
            [abcdefgh, ijklmnop],
            [abcdefghijklmnop]
        ]

        // Validate tree information
        expect(tree.getLevel(0)).toEqual(levels[4]);
        expect(tree.getLevel(1)).toEqual(levels[3]);
        expect(tree.getLevel(2)).toEqual(levels[2]);
        expect(tree.getLevel(3)).toEqual(levels[1]);
        expect(tree.getLevel(4)).toEqual(levels[0]);

        expect(tree.getLevels()).toEqual(levels);

        expect(tree.getLeaf("a")).toEqual({ key: "a", value: a})
        expect(tree.getLeaf("b")).toEqual({ key: "b", value: b})
        expect(tree.getLeaf("c")).toEqual({ key: "c", value: c})
        expect(tree.getLeaf("d")).toEqual({ key: "d", value: d})
        expect(tree.getLeaf("e")).toEqual({ key: "e", value: e})
        expect(tree.getLeaf("f")).toEqual({ key: "f", value: f})
        expect(tree.getLeaf("g")).toEqual({ key: "g", value: g})
        expect(tree.getLeaf("h")).toEqual({ key: "h", value: h})
        expect(tree.getLeaf("i")).toEqual({ key: "i", value: i})
        expect(tree.getLeaf("j")).toEqual({ key: "j", value: j})
        expect(tree.getLeaf("k")).toEqual({ key: "k", value: k})
        expect(tree.getLeaf("l")).toEqual({ key: "l", value: l})
        expect(tree.getLeaf("m")).toEqual({ key: "m", value: m})
        expect(tree.getLeaf("n")).toEqual({ key: "n", value: n})
        expect(tree.getLeaf("o")).toEqual({ key: "o", value: o})
        expect(tree.getLeaf("p")).toEqual({ key: "p", value: p})

        expect(tree.getAlgorithm()).toEqual("sha-256");

        let pathA: Path[] = [
            {r: b},
            {r: cd},
            {r: efgh},
            {r: ijklmnop},
        ]

        let pathB: Path[] = [
            {l: a},
            {r: cd},
            {r: efgh},
            {r: ijklmnop},
        ]

        let pathC: Path[] = [
            {r: d},
            {l: ab},
            {r: efgh},
            {r: ijklmnop},
        ]

        let pathD: Path[] = [
            {l: c},
            {l: ab},
            {r: efgh},
            {r: ijklmnop}
        ]

        let pathE: Path[] = [
            {r: f},
            {r: gh},
            {l: abcd},
            {r: ijklmnop}
        ]

        let pathF: Path[] = [
            {l: e},
            {r: gh},
            {l: abcd},
            {r: ijklmnop}
        ]

        let pathG: Path[] = [
            {r: h},
            {l: ef},
            {l: abcd},
            {r: ijklmnop}
        ]

        let pathH: Path[] = [
            {l: g},
            {l: ef},
            {l: abcd},
            {r: ijklmnop}
        ]

        let pathI: Path[] = [
            {r: j},
            {r: kl},
            {r: mnop},
            {l: abcdefgh}
        ]

        let pathJ: Path[] = [
            {l: i},
            {r: kl},
            {r: mnop},
            {l: abcdefgh}
        ]

        let pathK: Path[] = [
            {r: l},
            {l: ij},
            {r: mnop},
            {l: abcdefgh},
        ]

        let pathL: Path[] = [
            {l: k},
            {l: ij},
            {r: mnop},
            {l: abcdefgh}
        ]

        let pathM: Path[] = [
            {r: n},
            {r: op},
            {l: ijkl},
            {l: abcdefgh}
        ]

        let pathN: Path[] = [
            {l: m},
            {r: op},
            {l: ijkl},
            {l: abcdefgh}
        ]

        let pathO: Path[] = [
            {r: p},
            {l: mn},
            {l: ijkl},
            {l: abcdefgh},
        ]

        let pathP: Path[] = [
            {l: o},
            {l: mn},
            {l: ijkl},
            {l: abcdefgh}
        ]

        expect(tree.getPath("a")).toEqual(pathA);
        expect(tree.getPath("b")).toEqual(pathB);
        expect(tree.getPath("c")).toEqual(pathC);
        expect(tree.getPath("d")).toEqual(pathD);
        expect(tree.getPath("e")).toEqual(pathE);
        expect(tree.getPath("f")).toEqual(pathF);
        expect(tree.getPath("g")).toEqual(pathG);
        expect(tree.getPath("h")).toEqual(pathH);
        expect(tree.getPath("i")).toEqual(pathI);
        expect(tree.getPath("j")).toEqual(pathJ);
        expect(tree.getPath("k")).toEqual(pathK);
        expect(tree.getPath("l")).toEqual(pathL);
        expect(tree.getPath("m")).toEqual(pathM);
        expect(tree.getPath("n")).toEqual(pathN);
        expect(tree.getPath("o")).toEqual(pathO);
        expect(tree.getPath("p")).toEqual(pathP);
    });

    it("Should build correct tree (odd leaves)", () => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        builder.add("b", Buffer.from("b"));
        builder.add("c", Buffer.from("c"));
        builder.add("d", Buffer.from("d"));
        builder.add("e", Buffer.from("e"));
        builder.add("f", Buffer.from("f"));
        builder.add("g", Buffer.from("g"));
        builder.add("h", Buffer.from("h"));

        builder.addBatch([
            { key: "i", value: Buffer.from("i") },
            { key: "j", value: Buffer.from("j") },
            { key: "k", value: Buffer.from("k") },
            { key: "l", value: Buffer.from("l") },
            { key: "m", value: Buffer.from("m") },
            { key: "n", value: Buffer.from("n") },
            { key: "o", value: Buffer.from("o") },
        ]);

        let tree = builder.build();

        let l4 = ["a:"+a, "b:"+b,"c:"+c,"d:"+d,"e:"+e,"f:"+f,"g:"+g,"h:"+h,"i:"+i,"j:"+j,"k:"+k,"l:"+l,"m:"+m,"n:"+n,"o:"+o];
        let l3 = [ab, cd, ef, gh, ij, kl, mn, o]
        let l2 = [abcd, efgh, ijkl, mno]
        let l1 = [abcdefgh, ijklmno]
        let l0 = [abcdefghijklmno]

        expect(tree.getLevel(0)).toEqual(l0);
        expect(tree.getLevel(1)).toEqual(l1);
        expect(tree.getLevel(2)).toEqual(l2);
        expect(tree.getLevel(3)).toEqual(l3);
        expect(tree.getLevel(4)).toEqual(l4);

        expect(tree.getLeaf("a")).toEqual({ key: "a", value: a})
        expect(tree.getLeaf("b")).toEqual({ key: "b", value: b})
        expect(tree.getLeaf("c")).toEqual({ key: "c", value: c})
        expect(tree.getLeaf("d")).toEqual({ key: "d", value: d})
        expect(tree.getLeaf("e")).toEqual({ key: "e", value: e})
        expect(tree.getLeaf("f")).toEqual({ key: "f", value: f})
        expect(tree.getLeaf("g")).toEqual({ key: "g", value: g})
        expect(tree.getLeaf("h")).toEqual({ key: "h", value: h})
        expect(tree.getLeaf("i")).toEqual({ key: "i", value: i})
        expect(tree.getLeaf("j")).toEqual({ key: "j", value: j})
        expect(tree.getLeaf("k")).toEqual({ key: "k", value: k})
        expect(tree.getLeaf("l")).toEqual({ key: "l", value: l})
        expect(tree.getLeaf("m")).toEqual({ key: "m", value: m})
        expect(tree.getLeaf("n")).toEqual({ key: "n", value: n})
        expect(tree.getLeaf("o")).toEqual({ key: "o", value: o})

        expect(tree.getAlgorithm()).toEqual("sha-256");

        // Validate paths
        let pathA: Path[] = [
            {r: b},
            {r: cd},
            {r: efgh},
            {r: ijklmno},
        ]

        let pathB: Path[] = [
            {l: a},
            {r: cd},
            {r: efgh},
            {r: ijklmno},
        ]

        let pathC: Path[] = [
            {r: d},
            {l: ab},
            {r: efgh},
            {r: ijklmno},
        ]

        let pathD: Path[] = [
            {l: c},
            {l: ab},
            {r: efgh},
            {r: ijklmno}
        ]

        let pathE: Path[] = [
            {r: f},
            {r: gh},
            {l: abcd},
            {r: ijklmno}
        ]

        let pathF: Path[] = [
            {l: e},
            {r: gh},
            {l: abcd},
            {r: ijklmno}
        ]

        let pathG: Path[] = [
            {r: h},
            {l: ef},
            {l: abcd},
            {r: ijklmno}
        ]

        let pathH: Path[] = [
            {l: g},
            {l: ef},
            {l: abcd},
            {r: ijklmno}
        ]

        let pathI: Path[] = [
            {r: j},
            {r: kl},
            {r: mno},
            {l: abcdefgh}
        ]

        let pathJ: Path[] = [
            {l: i},
            {r: kl},
            {r: mno},
            {l: abcdefgh}
        ]

        let pathK: Path[] = [
            {r: l},
            {l: ij},
            {r: mno},
            {l: abcdefgh},
        ]

        let pathL: Path[] = [
            {l: k},
            {l: ij},
            {r: mno},
            {l: abcdefgh}
        ]

        let pathM: Path[] = [
            {r: n},
            {r: o},
            {l: ijkl},
            {l: abcdefgh}
        ]

        let pathN: Path[] = [
            {l: m},
            {r: o},
            {l: ijkl},
            {l: abcdefgh}
        ]

        let pathO: Path[] = [
            {l: mn},
            {l: ijkl},
            {l: abcdefgh},
        ]

        expect(tree.getPath("a")).toEqual(pathA);
        expect(tree.getPath("b")).toEqual(pathB);
        expect(tree.getPath("c")).toEqual(pathC);
        expect(tree.getPath("d")).toEqual(pathD);
        expect(tree.getPath("e")).toEqual(pathE);
        expect(tree.getPath("f")).toEqual(pathF);
        expect(tree.getPath("g")).toEqual(pathG);
        expect(tree.getPath("h")).toEqual(pathH);
        expect(tree.getPath("i")).toEqual(pathI);
        expect(tree.getPath("j")).toEqual(pathJ);
        expect(tree.getPath("k")).toEqual(pathK);
        expect(tree.getPath("l")).toEqual(pathL);
        expect(tree.getPath("m")).toEqual(pathM);
        expect(tree.getPath("n")).toEqual(pathN);
        expect(tree.getPath("o")).toEqual(pathO);
    });

    it("Should validate multi proof", async() => {
        let builder = newBuilder("sha-256");
        builder.add("a", Buffer.from("a"));
        builder.add("b", Buffer.from("b"));
        builder.add("c", Buffer.from("c"));
        builder.add("d", Buffer.from("d"));
        builder.add("e", Buffer.from("e"));
        builder.add("f", Buffer.from("f"));
        builder.add("g", Buffer.from("g"));
        builder.add("h", Buffer.from("h"));

        builder.addBatch([
            { key: "i", value: Buffer.from("i") },
            { key: "j", value: Buffer.from("j") },
            { key: "k", value: Buffer.from("k") },
            { key: "l", value: Buffer.from("l") },
            { key: "m", value: Buffer.from("m") },
            { key: "n", value: Buffer.from("n") },
            { key: "o", value: Buffer.from("o") },
        ]);

        let tree = builder.build();

        await expect(tree.validateProof(HEDERA_MAINNET_PROOF)).resolves.toBe(true);
        await expect(tree.validateProof(HEDERA_TESTNET_PROOF)).resolves.toBe(true);
        await expect(tree.validateProof(ETHEREUM_TESTNET_PROOF)).resolves.toBe(true);
    })

    it("Should validate multi proof with path", async() => {
        let builder = newBuilder("sha-256");
        builder.add("c", Buffer.from("c"));
        let tree = builder.build();
        await expect(tree.validateProof(HEDERA_MAINNET_PROOF_PATH)).resolves.toBe(true);
        await expect(tree.validateProof(HEDERA_TESTNET_PROOF_PATH)).resolves.toBe(true);
        await expect(tree.validateProof(ETHEREUM_TESTNET_PROOF_PATH)).resolves.toBe(true);
    })
});
