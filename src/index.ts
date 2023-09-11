import {Metadata} from "@grpc/grpc-js/src/metadata";
import {Status} from "@grpc/grpc-js/src/constants";
import {StatusBuilder} from "@grpc/grpc-js/src/status-builder";
import {StatusObject} from "@grpc/grpc-js/src/call-interface";

export default function GrpcError(
   code: Status | null,
   details: string | null,
   metadata: Metadata | null,
):  Partial<StatusObject> {
   const e = new StatusBuilder()
   if (code) e.withCode(code)
   if (details) e.withDetails(details)
   if (metadata) e.withMetadata(metadata)
   return e.build()
}

