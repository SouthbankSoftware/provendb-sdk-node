# provendb-sdk-node
The ProvenDB SDK for Node.

## Libraries

| Name | Description | Import |
| :--- | :---------- | :----- |
| [anchor](./src/anchor) | The ProvenDB Anchor client. | `import { anchor } from "provendb-sdk-node";` |
| [merkle](./src/merkle) | A merkle tree library. | `import { merkle } from "provendb-sdk-node";` |

## Examples

## Hello World!

This Hello, World example uses both the [anchor](./src/anchor) and [merkle](./src/merkle) libraries to generate
a merkle tree and submit the tree's root hash to the blockchain via the ProvenDB Anchor service.

First, we need to construct our merkle tree:

```js
import { anchor } from "provendb-sdk-node";
import { merkle } from "provendb-sdk-node";

// Create the new builder
let builder = merkle.newBuilder("sha-256");

// Add your key/values.
builder.add("key1", Buffer.from("Hello, "));
builder.add("key2", Buffer.from("World, !"));

// Construct the tree
let tree = builder.build();

// Once you have your tree object, you are now ready to anchor it! To anchor it, we use the root hash
// of the merkle tree and submit it to the ProvenDB Anchor service. Create your new anchor client.
let client = anchor.connect(anchor.withCredentials("YOUR_API_KEY"));

// Create your proof.
let proof = await client.submitProof(tree.getRoot(), 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.HEDERA_MAINNET), // Optional. Add your anchor type.
    anchor.submitProofWithAwaitConfirmed(true)); // Optional. Resolve the promise only when the proof is confirmed.

// Add your proof to the tree object.
tree.addProof(proof);

// Export it to file
tree.exportSync("./merkle.json");
```

Congratulations, you have successfully created and anchored your first `Hello, World!` proof!
