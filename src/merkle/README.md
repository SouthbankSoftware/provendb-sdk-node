# merkle

A library for constructing a Merkle tree.

## Contents
- [Install](#install)
- [Getting Started](#getting-started)
    - [Building a MerkleTree](#building-a-merkletree)
    - [Exploring a MerkleTree](#exploring-a-merkletree)
    - [Creating Proofs](#creating-proofs)
    - [Verifying Proofs](#verifying-proofs)
    - [Adding Merkle Path to Proof](#adding-merkle-path-to-proof)
    - [MerkleFile](#merklefile)
        - [Export](#export)
        - [Import](#import)
- [Documentation](#documentation)

## Getting Started

```js
import { merkle } from "provendb-sdk-node";
```

### Important Information

The order of items being added to the tree is important in the reconstruction of a duplicate tree from the same data. That being said,
you need to ensure that you are adding items to the tree in a determinite way. If you are using asyncronous operations in your application to add items to the tree,
you need to ensure the asyncronous operations have completed before adding the next items to the tree.

### Building a MerkleTree 

To construct a new merkle tree, use the `Builder`. The builder class provides dynamic building
of a merkle tree. 

```js
import { merkle } from "provendb-sdk-node";

let builder = merkle.newBuilder("sha-256");
```

Adding items can be done singularly (`add()`), or in bulk (`addBatch()`). Any data being added must
be of `Buffer` type.

```js
// Adding items singularly with key/value
builder.add("key1", Buffer.from("m"));
builder.add("key2", Buffer.from("e"));
builder.add("key3", Buffer.from("r"));
builder.add("key4", Buffer.from("k"));
builder.add("key5", Buffer.from("l"));
builder.add("key6", Buffer.from("e"));

// Adding items in batches
builder.addBatch([
    { key: "key7", value: Buffer.from("t") },
    { key: "key8", value: Buffer.from("r") },
    { key: "key9", value: Buffer.from("e") },
    { key: "key10", value: Buffer.from("e") }
]);
```

For larger items, you can stream in chunks of data that will be digested upon completion.

**Please Note** - ensure you have read [Important Information](#important-information) for asyncronous operations.

```js
// Create the write stream
let stream = builder.writeStream();

// Read stream from file and add to write stream
fs.createReadStream("./testing/file_10000.txt")
    .on("data", (d: Buffer) => {
        stream.write(d);
    })
    .on("end", () => {
        stream.close();
    })
    .on("error", (err) => console.log(err));
```

Once you have finished adding your items, you can build the `Tree`.

```js
let tree = builder.build();
```

### Exploring a MerkleTree

When you construct a tree using the `Builder`, the final result is a `Tree`.

For our example, let's take the following constructed tree:

```js
let tree = merkle.builder("sha256").addBatch([
    { key: "key1", value: Buffer.from("m") },
    { key: "key2", value: Buffer.from("e") },
    { key: "key3", value: Buffer.from("r") },
    { key: "key4", value: Buffer.from("k") },
    { key: "key5", value: Buffer.from("l") },
    { key: "key6", value: Buffer.from("e") },
    { key: "key7", value: Buffer.from("t") },
    { key: "key8", value: Buffer.from("r") },
    { key: "key9", value: Buffer.from("e") },
    { key: "key10", value: Buffer.from("e") },
]);
```

We can retrieve the tree information as follows:

```js
// Retrieves the algorithm used to construct the tree. Returns "sha256"
tree.getAlgorithm();

// Retrieves the number of levels in the tree. Returns 5.
tree.nLevels(); // returns 5

// Retrieves the depth of the tree. Returns 4.
tree.nDepth(); // returns 4

// Retrieves the number of nodes in the tree. Returns 11.
tree.nNodes();

// Retrieves the number of leaves in the tree. Returns 10.
tree.nLeaves();

// Retrieves the root hash of the tree. Returns "da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c"
tree.getRoot();

// Retrieve a single leaf. Returns
// { key: 'key1', hash: '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a' }
tree.getLeaf("key1");

// Retrieves an array of all the leaves in the tree. Returns
// [
//   { key: 'key1', hash: '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a' },
//   { key: 'key2', hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
//   { key: 'key3', hash: '454349e422f05297191ead13e21d3db520e5abef52055e4964b82fb213f593a1' },
//   { key: 'key4', hash: '8254c329a92850f6d539dd376f4816ee2764517da5e0235514af433164480d7a' },
//   { key: 'key5', hash: 'acac86c0e609ca906f632b0e2dacccb2b77d22b0621f20ebece1a4835b93f6f0' },
//   { key: 'key6', hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
//   { key: 'key7', hash: 'e3b98a4da31a127d4bde6e43033f66ba274cab0eb7eb1c70ec41402bf6273dd8' },
//   { key: 'key8', hash: '454349e422f05297191ead13e21d3db520e5abef52055e4964b82fb213f593a1' },
//   { key: 'key9', hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' },
//   { key: 'key10', hash: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea' }
// ]
tree.getLeaves();

// Retrieves a specific level in the tree. Returns
// [
//     "cc2e1597613b45fddba2896c67f0d6c0f6ab2d8351057a06c943e03711c39ac9",
//     "75de222d8adebd767f99a5fe35a5f3f58dbfa3d51ec28b54e9da4225ec8f170d"
// ]
tree.getLevel(1);

// Retrieve the merkle path from a specific leaf. The boolean flag specifies whether the input
// has already been hashed.
// Returns an array of left and right values all the way to the root:
// [
//   {
//     r: '3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea'
//   },
//   {
//     r: '59607c4c6d90e990de7439330e27794eccd2e6d9e985b0aa3822032cafa7e8a8'
//   },
//   {
//     r: '7dd7d88a2b96da7e3b886f5832c0ad97e789aae9394a81797b788c3f3e24c5f3'
//   },
//   {
//     r: '75de222d8adebd767f99a5fe35a5f3f58dbfa3d51ec28b54e9da4225ec8f170d'
//   }
// ]
tree.getPath("62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a", true);
```

### Adding Merkle Path to Proof

If you would like your proof to contain the path to a specific leaf in the tree, you can do this by using
`addPathToProof()`. This will calculate the path to the root of the tree, and prepend it to the proof receipt such
that the anchored hash can still be calculated.

```js
let proof = tree.addPathToProof(your_proof, tree,getLeaf("key1"), "my_custom_label");
```

A proof with the path should look like the following:

```js
{
    "@context": "https://w3id.org/chainpoint/v3",
    "type": "Chainpoint",
    "hash": "62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a",
    "hash_id_node": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
    "hash_submitted_node_at": "2021-02-25T21:31:53Z",
    "hash_id_core": "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
    "hash_submitted_core_at": "2021-02-25T21:31:53Z",
    "branches": [
        {
            "label": "my_custom_label",
            "ops": [
                {
                    "r": "3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea"
                },
                {
                    "op": "sha-256"
                },
                {
                    "r": "59607c4c6d90e990de7439330e27794eccd2e6d9e985b0aa3822032cafa7e8a8"
                },
                {
                    "op": "sha-256"
                },
                {
                    "r": "7dd7d88a2b96da7e3b886f5832c0ad97e789aae9394a81797b788c3f3e24c5f3"
                },
                {
                    "op": "sha-256"
                },
                {
                    "r": "75de222d8adebd767f99a5fe35a5f3f58dbfa3d51ec28b54e9da4225ec8f170d"
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
                                    "anchor_id": "724718a4eefb7d117f39b25b4131df741b15813ea83776bacd887d1dc7ea8b53",
                                    "uris": [
                                        "https://anchor.dev.proofable.io/verify/eth/724718a4eefb7d117f39b25b4131df741b15813ea83776bacd887d1dc7ea8b53"
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
```

### File

A `File` is a representation of a merkle tree that this library understands. A `File` has the following fields:

| Name | Type | Description |
| :----| :----| :----------- |
| algorithm | string | The algorithm used to construct the tree. |
| proofs | anchor.AnchorProof[] | An array of anchor proof objects associated with this tree. |
| data | string[][] | A two-dimensional array that contains the tree data. See [Representation of data](#representation-of-data) |

### Representation of data

To avoid deep nesting, a two-dimensional array is used to represent the data in the merkle tree. All data is represented as a hash using the algorithm defined in the file.

The index `data[0]` contains an array of the leaves, represented from left (`data[0][0]`) to right (`data[0][data[0].length - 1]`), while position `data[data.length - 1]` contains an array with a single element
representing the root hash.

### Export

You can export to a file in JSON format using `exportSync()` in your tree object.

```js
// Syncronously export the tree
tree.exportSync("./merkle_tree.json");
```

### Import

You can import a `File` using the `importSync()`.

```js
// Syncronously import a tree from file
let imported = merkle.importSync("./merkle_tree.json");
```

## Documentation

TODO