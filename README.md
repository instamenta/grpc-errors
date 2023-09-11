## GrpcError Builder 👷‍♂️

Super simple package which brings great utility function to create gRPC error objects with ease.
It simplifies the process of building error objects with customizable error codes, details, and metadata.

## Installation 🛠️

You can install GrpcError using npm:

```bash
npm install @instamenta/grpc-errors
```

## Usage 🚀

Import the necessary modules:

```
import GrpcError, {Status, Metadata} from "grpc-error-builder";
```

Create a gRPC error with your desired code, details, and metadata:

```
call.emit(GrpcError(
    Status.NOT_FOUND, 
    "Resource not found", 
    { key: "value" },
));
```

### OR 💥 ||

```
callback(GrpcError(
    Status.NOT_FOUND,
    "Resource not found",
    { key: "value" },
));
```

Parameters 📋

* code (Status): The gRPC error code (e.g., Status.NOT_FOUND).
* details (string): Optional error details.
* metadata (Metadata): Optional metadata to attach to the error.

License 📜

This package is licensed under the MIT License.

