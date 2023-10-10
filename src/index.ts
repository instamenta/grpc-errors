import {ServerErrorResponse, Metadata, ServerWritableStream, sendUnaryData} from '@grpc/grpc-js';
import {ZodError, ZodIssue} from 'zod';

/**
 * Defines interface with default set of keys for gRPC error
 * types to be provided for generic
 * or extended in case new errors are added.
 */
export interface IGrpcErrorKeys {
    INVALID_ARGUMENT: 'INVALID_ARGUMENT';
    DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED';
    NOT_FOUND: 'NOT_FOUND';
    ALREADY_EXISTS: 'ALREADY_EXISTS';
    PERMISSION_DENIED: 'PERMISSION_DENIED';
    INTERNAL: 'INTERNAL';
    UNAVAILABLE: 'UNAVAILABLE';
    DATA_LOSS: 'DATA_LOSS';
    UNAUTHENTICATED: 'UNAUTHENTICATED';
    FAILED_PRECONDITION: 'FAILED_PRECONDITION';
    VALIDATION: 'VALIDATION';
    UNAUTHORIZED: 'UNAUTHORIZED';
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND';
}

//! GRPC DEFAULT ERRORS
const invalidArgumentError: ServerErrorResponse = {
    name: 'InvalidArgument',
    code: 3, //? GRPC error code for "INVALID ARGUMENT"
    details: '',
    metadata: new Metadata(),
    message: 'Invalid argument provided.',
};

const deadlineExceededError: ServerErrorResponse = {
    name: 'DeadlineExceeded',
    code: 4, //? GRPC error code for "DEADLINE EXCEEDED"
    details: '',
    metadata: new Metadata(),
    message: 'Deadline for the operation exceeded.',
};

const notFoundError: ServerErrorResponse = {
    name: 'NotFound',
    code: 5, //? GRPC error code for "NOT FOUND"
    details: '',
    metadata: new Metadata(),
    message: 'Resource not found.',
};

const alreadyExistsError: ServerErrorResponse = {
    name: 'AlreadyExists',
    code: 6, //? GRPC error code for "ALREADY EXISTS"
    details: '',
    metadata: new Metadata(),
    message: 'Resource already exists.',
};

const permissionDeniedError: ServerErrorResponse = {
    name: 'PermissionDenied',
    code: 7, //? GRPC error code for "PERMISSION DENIED"
    details: '',
    metadata: new Metadata(),
    message: 'Permission denied for the operation.',
};

const internalError: ServerErrorResponse = {
    name: 'Internal',
    code: 13, //? GRPC error code for "INTERNAL"
    details: 'Server ran into unexpected internal error.',
    metadata: new Metadata(),
    message: 'Internal server error.',
};

const unavailableError: ServerErrorResponse = {
    name: 'Unavailable',
    code: 14, //? GRPC error code for "UNAVAILABLE"
    details: '',
    metadata: new Metadata(),
    message: 'Service unavailable.',
};

const dataLossError: ServerErrorResponse = {
    name: 'DataLoss',
    code: 15, //? GRPC error code for "DATA LOSS"
    details: '',
    metadata: new Metadata(),
    message: 'Data loss occurred.',
};

const unauthenticatedError: ServerErrorResponse = {
    name: 'Unauthenticated',
    code: 16, //? GRPC error code for "UNAUTHENTICATED"
    details: '',
    metadata: new Metadata(),
    message: 'Request not authenticated.',
};

const failedPreconditionError: ServerErrorResponse = {
    name: 'FailedPrecondition',
    code: 9, //? GRPC error code for "FAILED PRECONDITION"
    details: '',
    metadata: new Metadata(),
    message: 'Operation failed precondition check.',
};

const validationError: ServerErrorResponse = {
    name: 'GrpcValidationError',
    code: 3, // GRPC error code for "INVALID ARGUMENT"
    details: '',
    metadata: new Metadata(),
    message: 'gRPC validation error occurred.',
};

const unauthorizedError: ServerErrorResponse = {
    name: 'GrpcUnauthorized',
    code: 16, // GRPC error code for "UNAUTHENTICATED"
    details: '',
    metadata: new Metadata(),
    message: 'gRPC unauthorized access.',
};

const resourceNotFoundError: ServerErrorResponse = {
    name: 'GrpcResourceNotFound',
    code: 5, // GRPC error code for "NOT FOUND"
    details: '',
    metadata: new Metadata(),
    message: 'gRPC resource not found.',
};



/**
 * * Class that provides utility functions for managing gRPC errors. Logging meaningful errors to the console.
 *
 * ! With unmatched type safety and extendability!
 *
 * @template T - string literal type representing gRPC error keys.
 * @class GrpcErrors
 */
export default class GrpcErrors<T extends IGrpcErrorKeys> {

    public K: T = {
        INVALID_ARGUMENT: 'INVALID_ARGUMENT',
        DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',
        NOT_FOUND: 'NOT_FOUND',
        ALREADY_EXISTS: 'ALREADY_EXISTS',
        PERMISSION_DENIED: 'PERMISSION_DENIED',
        INTERNAL: 'INTERNAL',
        UNAVAILABLE: 'UNAVAILABLE',
        DATA_LOSS: 'DATA_LOSS',
        UNAUTHENTICATED: 'UNAUTHENTICATED',
        FAILED_PRECONDITION: 'FAILED_PRECONDITION',
        VALIDATION: 'VALIDATION',
        UNAUTHORIZED: 'UNAUTHORIZED',
        RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    } as T;

    /**
     * A record of gRPC errors, where keys correspond to error codes
     * and values contain error details.
     */
    ERRORS = <Record<keyof T, ServerErrorResponse>>{
        INVALID_ARGUMENT: invalidArgumentError,
        DEADLINE_EXCEEDED: deadlineExceededError,
        NOT_FOUND: notFoundError,
        ALREADY_EXISTS: alreadyExistsError,
        PERMISSION_DENIED: permissionDeniedError,
        INTERNAL: internalError,
        UNAVAILABLE: unavailableError,
        DATA_LOSS: dataLossError,
        UNAUTHENTICATED: unauthenticatedError,
        FAILED_PRECONDITION: failedPreconditionError,
        VALIDATION: validationError,
        UNAUTHORIZED: unauthorizedError,
        RESOURCE_NOT_FOUND: resourceNotFoundError,
    };

    /**
     * * Creates and returns a new instance of the GrpcErrors class.
     *
     * @template T - string literal type representing gRPC error keys.
     * @returns - new instance of the GrpcErrors class.
     */
    static getInstance<T extends IGrpcErrorKeys>(): GrpcErrors<T> {
        return new GrpcErrors<T>();
    }

    /**
     * * Extends the ERRORS record with a custom gRPC error object.
     *
     * @param _key - The key representing the custom gRPC error type.
     * @param _error - The custom gRPC error object to add to the ERRORS record.
     * @param _metadata - Additional metadata to attach to the custom gRPC error (if available).
     * @param _details - Additional details about the custom gRPC error (if available).
     */
    public EXTEND({
                      _key,
                      _error,
                      _metadata = null,
                      _details = null,
                  }: I_EXTEND<T>
    ): void {
        this.ERRORS[_key] = _error;
    }

    /**
     * * Throws a gRPC error and logs it.
     *
     * @param _key - The key representing the gRPC error type.
     * @param _source - The source of the error (if available).
     * @param _metadata - Additional metadata to attach to the gRPC error.
     * @param _details - Additional details about the error (if available).
     * @returns - The thrown gRPC error response.
     */
    public T({
                     _key,
                     _source = null,
                     _metadata = null,
                     _details = null,
                 }: I_THROW<T>
    ): ServerErrorResponse {
        const key = String(_key)
        console.log(_source ? `[ Emitting GRPC ERROR: [ ${key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${key} ] ]`);
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        return _error;
    }

    /**
     * * Emits a gRPC error on a writable stream and logs it.
     *
     * @param call - The writable stream on which to emit the gRPC error.
     * @param _key - The key representing the gRPC error type.
     * @param _source - The source of the error (if available).
     * @param _metadata - Additional metadata to attach to the gRPC error.
     * @param _details - Additional details about the error (if available).
     */
    public E({
                    call,
                    _key,
                    _source = null,
                    _metadata = null,
                    _details = null,
                }: I_EMIT<T>
    ): void {
        const key = String(_key)
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        call.emit('error', _error)
        return console.log(_source ? `[ Emitting GRPC ERROR: [ ${key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${key} ] ]`);
    }

    /**
     * * Calls a callback function with a gRPC error and logs it.
     *
     * @param callback - The callback function to call with the gRPC error.
     * @param _key - The key representing the gRPC error type.
     * @param _source - The source of the error (if available).
     * @param _metadata - Additional metadata to attach to the gRPC error.
     * @param _details - Additional details about the error (if available).
     */
    public CB({
                        callback,
                        _key,
                        _source = null,
                        _metadata = null,
                        _details = null,
                    }: I_CALLBACK<T>
    ): void {
        const key = String(_key)
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        callback(_error)
        return console.log(_source ? `[ Emitting GRPC ERROR: [ ${key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${key} ] ]`);
    }

    /**
     * * Converts a Zod error to a gRPC error response with metadata and details.
     *
     * @param error - The Zod error to convert.
     * @returns - The gRPC error response.
     */
    public handleZodError(error: ZodError): ServerErrorResponse {
        const _error = this.ERRORS.VALIDATION;
        const _metadata = new Metadata();
        error?.errors?.forEach((e: ZodIssue, i: number) => {
            _metadata.set(`error_${i}`, e.message);
        });
        _error.metadata = _metadata;
        _error.details = error?.errors?.map((e) => e.message).join(', ');
        return _error;
    }

}

/**
 * * Get default Class instance.
 *
 * @type {GrpcErrors<IGrpcErrorKeys>}
 */
export const w = GrpcErrors.getInstance<IGrpcErrorKeys>();

export interface I_EXTEND<T> {
    _key: keyof T;
    _error: ServerErrorResponse;
    _metadata?: null | Metadata;
    _details?: string | null;
}

export interface I_THROW<T> {
    _key: keyof T;
    _source?: string | null;
    _metadata?: null | Metadata;
    _details?: string | null;
}

export interface I_EMIT<T> {
    call: ServerWritableStream<any, any>;
    _key: keyof T;
    _source?: string | null;
    _metadata?: null | Metadata;
    _details?: string | null;
}

export interface I_CALLBACK<T> {
    callback: sendUnaryData<any>;
    _key: keyof T;
    _source?: string | null;
    _metadata?: null | Metadata;
    _details?: string | null;
}
