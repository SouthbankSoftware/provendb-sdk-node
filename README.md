# provendb-sdk-node

The ProvenDB SDK for Node.

**NOTE**: The SDK is in alpha and not recommended for production use. For any bugs, please raise an [issue](https://github.com/SouthbankSoftware/provendb-sdk-node/issues).

## Installation

`npm install provendb-sdk-node`

## Libraries

| Name | Description | Import |
| :--- | :---------- | :----- |
| [anchor](./src/anchor) | The ProvenDB Anchor client. | `import { anchor } from "provendb-sdk-node";` |
| [merkle](./src/merkle) | A merkle tree library. | `import { merkle } from "provendb-sdk-node";` |

## Examples

## Hello World!

This Hello, World example uses both the [anchor](./src/anchor) and [merkle](./src/merkle) libraries to generate
a merkle tree and submit the tree's root hash to Hedera via the ProvenDB Anchor service.

```js
import { anchor, merkle } from "provendb-sdk-node";

// Create the new builder and add your data.
let builder = merkle.newBuilder("sha-256");
builder.add("key1", Buffer.from("Hello, "));
builder.add("key2", Buffer.from("World, !"));

// Construct the tree.
let tree = builder.build();

// Create a new anchor client using your credentials (contact us to get credentials)
let client = anchor.connect(anchor.withCredentials("YOUR_API_KEY"));

// Submit your proof.
let proof = await client.submitProof(tree.getRoot(), 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.HEDERA_MAINNET), // Optional. Add your anchor type.
    anchor.submitProofWithAwaitConfirmed(true)); // Optional. Resolve the promise only when the proof is confirmed.

// Add your proof to the tree object.
tree.addProof(proof);

// Export it to file
tree.exportSync("./merkle.json");
```

Congratulations, you have successfully created, anchored and exported your first `Hello, World!` proof!

## Documentation

Full API documentation not yet available.