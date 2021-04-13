# anchor

This official ProvenDB Anchor client. 

This library provides a gRPC wrapped client for easy usage in projects, as well as the generated protobuf files for those that
wish to use the protobuf generated code directly.

Service definitions for the ProvenDB Anchor service can be found [here](https://github.com/SouthbankSoftware/provendb-apis/tree/main/anchor).

## Contents

- [Usage](#usage)
- [Creating The Client](#creating-the-client)


## Usage 

```js
import { anchor } from "provendb-sdk-node";
```

## Creating The Client

```js
let client = anchor.connect(anchor.withCredentials("YOUR_CREDENTIALS"));
```


