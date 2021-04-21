# anchor

The official ProvenDB Anchor client. 

This library provides a gRPC wrapped client for easy usage in projects, as well as the generated protobuf files for those that wish to use the protobuf generated code directly.

Service definitions for the ProvenDB Anchor service can be found [here](https://github.com/SouthbankSoftware/provendb-apis/tree/main/anchor).

## Contents

- [Usage](#usage)
- [Creating The Client](#creating-the-client)
- [Submitting a Proof](#submitting-a-proof)
- [Subscribing to Proof Changes](#subscribing-to-proof-changes)
- [Documentation](#documentation)

## Usage 

```js
import { anchor } from "provendb-sdk-node";
```

## Creating The Client

```js
let client = anchor.connect(anchor.withCredentials("YOUR_CREDENTIALS"));
```

## Submitting a Proof

To submit a quick proof with defaults:

```js
let proof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c")
```

To submit a proof with options:

```js
let proof = client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c", 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.ETH), // your chosen anchor type
    anchor.submitProofWithSkipBatching(true), // whether to anchor immediately and skip the batching process
    anchor.submitProofWithFormat(anchor.Proof.Format.CHP_PATH),  // the proof format
    anchor.submitProofWithAwaitConfirmed(true)) // whether to return only when the proof status is CONFIRMED.
```

## Subscribing to Proof Changes

When a proof is submitted, it is yet to be confirmed (unless your specify `submitProofWithAwaitConfirmed` option). Depending on the chosen anchor type, it may take a while for a proof to be `CONFIRMED` status. By subscribing to a proof, you will receive an updated proof when its status changes.

```js
let proof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c")

client.subscribeProof(proof, callback(err, proof) => {
    if (err) {
        // handle error
    } else {
        // do something
    }
})
```

Alternatively, you can retrieve a proof without subscribing by periodically calling `getProof`.

```js
let submitted = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c")

// Update the proof with getProof
let updated = await getProof(proof.hash, proof.batchId, proof.anchorType)
```

## Documentation

Full API documentation not yet available. You can browse the source code in the meantime to see available functions.