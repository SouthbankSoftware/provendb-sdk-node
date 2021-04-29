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
let proof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c");
```

To submit a proof and wait for the proof to be `CONFIRMED` before resolving the promise, add the `submitProofWithAwaitConfirmed` option:

```js
let proof = await client.submitProof("da63e4bd82fc6e5d7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c", 
    anchor.submitProofWithAwaitConfirmed(true));
```

To submit a proof with different anchor types, add the `submitProofWithAnchorType` option:

```js
let hederaProof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c", 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.HEDERA_MAINNET));

let ethereumProof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c", 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.ETH_MAINNET));

let bitcoinProof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c", 
    anchor.submitProofWithAnchorType(anchor.Anchor.Type.BTC_MAINNET));
```

## Subscribing to Proof Changes

When a proof is submitted, it is yet to be confirmed (unless your specify `submitProofWithAwaitConfirmed` option). Depending on the chosen anchor type, it may take a while for a proof to be `CONFIRMED` status. By subscribing to a proof, you will receive an updated proof when its status changes.

```js
let proof = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c")

client.subscribeProof(proof, callback(err, proof) => {
    if (err) {
        // handle error
    } else {
        // do something with proof
    }
})
```

Alternatively, you can retrieve a proof without subscribing by periodically calling `getProof`.

```js
// Submit the proof
let submitted = await client.submitProof("da63e4bd82fc6e5fd7337e6bd9147d8cada6652d9049020edc6deb69b18cf69c")

// Update the proof with getProof
let updated = await getProof(proof.hash, proof.batchId, proof.anchorType)
```

## Documentation

Full API documentation not yet available.