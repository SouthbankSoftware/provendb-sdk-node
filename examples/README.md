# Examples

Here you will find some examples on how to use the SDK.

## Hello World!

Let's create a simple Hello, World! merkle tree and anchor it to the blockchain!

First, we need to construct our merkle tree:

```js
import { merkle } from "provendb-sdk-node";

// Create the new builder
let builder = merkle.newBuilder("sha-256");

// Add your key/values.
builder.add("key1", Buffer.from("Hello, "));
builder.add("key2", Buffer.from("World, !"));

// Construct the tree
let tree = builder.build();

```

Once you have your tree object, you are now ready to anchor it! To anchor it, we use the root hash
of the merkle tree and submit it to the ProvenDB Anchor service.

```js
import { anchor } from "provendb-sdk-node";

// Connect to the anchor service.
let client = anchor.connect(anchor.withCredentials("YOUR_API_KEY"));

// Create your proof
let proof = await anchor.submitProof(tree.getRoot(), 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.HEDERA_MAINNET), // Optional. Add your anchor type.
    anchor.submitProofWithAwaitConfirmed(true)); // Optional. Resolve the promise only when the proof is confirmed.
```

Congratulations, you have successfully anchored your first `Hello, World!` proof! Let's save our proof to our merkle tree
and export it to a file.

```js
// Add your proof to the tree object.
tree.addProof(proof);

// Export it to file
tree.exportSync("./merkle,json");
```
