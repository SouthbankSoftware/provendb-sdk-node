export namespace AnchorServiceService {
    namespace getAnchors {
        export const path: string;
        export const requestStream: boolean;
        export const responseStream: boolean;
        export const requestType: typeof google_protobuf_empty_pb.Empty;
        export const responseType: typeof anchor_anchor_pb.Anchor;
        export { serialize_google_protobuf_Empty as requestSerialize };
        export { deserialize_google_protobuf_Empty as requestDeserialize };
        export { serialize_anchor_Anchor as responseSerialize };
        export { deserialize_anchor_Anchor as responseDeserialize };
    }
    namespace getAnchor {
        const path_1: string;
        export { path_1 as path };
        const requestStream_1: boolean;
        export { requestStream_1 as requestStream };
        const responseStream_1: boolean;
        export { responseStream_1 as responseStream };
        const requestType_1: typeof anchor_anchor_pb.AnchorRequest;
        export { requestType_1 as requestType };
        const responseType_1: typeof anchor_anchor_pb.Anchor;
        export { responseType_1 as responseType };
        export { serialize_anchor_AnchorRequest as requestSerialize };
        export { deserialize_anchor_AnchorRequest as requestDeserialize };
        export { serialize_anchor_Anchor as responseSerialize };
        export { deserialize_anchor_Anchor as responseDeserialize };
    }
    namespace getProof {
        const path_2: string;
        export { path_2 as path };
        const requestStream_2: boolean;
        export { requestStream_2 as requestStream };
        const responseStream_2: boolean;
        export { responseStream_2 as responseStream };
        const requestType_2: typeof anchor_anchor_pb.ProofRequest;
        export { requestType_2 as requestType };
        const responseType_2: typeof anchor_anchor_pb.Proof;
        export { responseType_2 as responseType };
        export { serialize_anchor_ProofRequest as requestSerialize };
        export { deserialize_anchor_ProofRequest as requestDeserialize };
        export { serialize_anchor_Proof as responseSerialize };
        export { deserialize_anchor_Proof as responseDeserialize };
    }
    namespace submitProof {
        const path_3: string;
        export { path_3 as path };
        const requestStream_3: boolean;
        export { requestStream_3 as requestStream };
        const responseStream_3: boolean;
        export { responseStream_3 as responseStream };
        const requestType_3: typeof anchor_anchor_pb.SubmitProofRequest;
        export { requestType_3 as requestType };
        const responseType_3: typeof anchor_anchor_pb.Proof;
        export { responseType_3 as responseType };
        export { serialize_anchor_SubmitProofRequest as requestSerialize };
        export { deserialize_anchor_SubmitProofRequest as requestDeserialize };
        export { serialize_anchor_Proof as responseSerialize };
        export { deserialize_anchor_Proof as responseDeserialize };
    }
    namespace verifyProof {
        const path_4: string;
        export { path_4 as path };
        const requestStream_4: boolean;
        export { requestStream_4 as requestStream };
        const responseStream_4: boolean;
        export { responseStream_4 as responseStream };
        const requestType_4: typeof anchor_anchor_pb.VerifyProofRequest;
        export { requestType_4 as requestType };
        const responseType_4: typeof anchor_anchor_pb.VerifyProofReply;
        export { responseType_4 as responseType };
        export { serialize_anchor_VerifyProofRequest as requestSerialize };
        export { deserialize_anchor_VerifyProofRequest as requestDeserialize };
        export { serialize_anchor_VerifyProofReply as responseSerialize };
        export { deserialize_anchor_VerifyProofReply as responseDeserialize };
    }
    namespace getBatch {
        const path_5: string;
        export { path_5 as path };
        const requestStream_5: boolean;
        export { requestStream_5 as requestStream };
        const responseStream_5: boolean;
        export { responseStream_5 as responseStream };
        const requestType_5: typeof anchor_anchor_pb.BatchRequest;
        export { requestType_5 as requestType };
        const responseType_5: typeof anchor_anchor_pb.Batch;
        export { responseType_5 as responseType };
        export { serialize_anchor_BatchRequest as requestSerialize };
        export { deserialize_anchor_BatchRequest as requestDeserialize };
        export { serialize_anchor_Batch as responseSerialize };
        export { deserialize_anchor_Batch as responseDeserialize };
    }
    namespace subscribeBatches {
        const path_6: string;
        export { path_6 as path };
        const requestStream_6: boolean;
        export { requestStream_6 as requestStream };
        const responseStream_6: boolean;
        export { responseStream_6 as responseStream };
        const requestType_6: typeof anchor_anchor_pb.SubscribeBatchesRequest;
        export { requestType_6 as requestType };
        const responseType_6: typeof anchor_anchor_pb.Batch;
        export { responseType_6 as responseType };
        export { serialize_anchor_SubscribeBatchesRequest as requestSerialize };
        export { deserialize_anchor_SubscribeBatchesRequest as requestDeserialize };
        export { serialize_anchor_Batch as responseSerialize };
        export { deserialize_anchor_Batch as responseDeserialize };
    }
}
export var AnchorServiceClient: import("@grpc/grpc-js/build/src/make-client").ServiceClientConstructor;
import google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb.js");
import anchor_anchor_pb = require("../anchor/anchor_pb.js");
declare function serialize_google_protobuf_Empty(arg: any): Buffer;
declare function deserialize_google_protobuf_Empty(buffer_arg: any): google_protobuf_empty_pb.Empty;
declare function serialize_anchor_Anchor(arg: any): Buffer;
declare function deserialize_anchor_Anchor(buffer_arg: any): anchor_anchor_pb.Anchor;
declare function serialize_anchor_AnchorRequest(arg: any): Buffer;
declare function deserialize_anchor_AnchorRequest(buffer_arg: any): anchor_anchor_pb.AnchorRequest;
declare function serialize_anchor_ProofRequest(arg: any): Buffer;
declare function deserialize_anchor_ProofRequest(buffer_arg: any): anchor_anchor_pb.ProofRequest;
declare function serialize_anchor_Proof(arg: any): Buffer;
declare function deserialize_anchor_Proof(buffer_arg: any): anchor_anchor_pb.Proof;
declare function serialize_anchor_SubmitProofRequest(arg: any): Buffer;
declare function deserialize_anchor_SubmitProofRequest(buffer_arg: any): anchor_anchor_pb.SubmitProofRequest;
declare function serialize_anchor_VerifyProofRequest(arg: any): Buffer;
declare function deserialize_anchor_VerifyProofRequest(buffer_arg: any): anchor_anchor_pb.VerifyProofRequest;
declare function serialize_anchor_VerifyProofReply(arg: any): Buffer;
declare function deserialize_anchor_VerifyProofReply(buffer_arg: any): anchor_anchor_pb.VerifyProofReply;
declare function serialize_anchor_BatchRequest(arg: any): Buffer;
declare function deserialize_anchor_BatchRequest(buffer_arg: any): anchor_anchor_pb.BatchRequest;
declare function serialize_anchor_Batch(arg: any): Buffer;
declare function deserialize_anchor_Batch(buffer_arg: any): anchor_anchor_pb.Batch;
declare function serialize_anchor_SubscribeBatchesRequest(arg: any): Buffer;
declare function deserialize_anchor_SubscribeBatchesRequest(buffer_arg: any): anchor_anchor_pb.SubscribeBatchesRequest;
export {};
