import {ZodError, ZodIssue} from 'zod';
import {ServerErrorResponse, Metadata, ServerWritableStream, sendUnaryData} from '@grpc/grpc-js';

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

/**
 * @class GrpcErrors
 * @implements IGrpcErrors
 */
export default class GrpcErrors<T extends string> implements IGrpcErrors<T> {


    ERRORS: Record<T, ServerErrorResponse> = {// @ts-ignore
        INVALID_ARGUMENT: invalidArgumentError,// @ts-ignore
        DEADLINE_EXCEEDED: deadlineExceededError,// @ts-ignore
        NOT_FOUND: notFoundError,// @ts-ignore
        ALREADY_EXISTS: alreadyExistsError,// @ts-ignore
        PERMISSION_DENIED: permissionDeniedError,// @ts-ignore
        INTERNAL: internalError,// @ts-ignore
        UNAVAILABLE: unavailableError,// @ts-ignore
        DATA_LOSS: dataLossError,// @ts-ignore
        UNAUTHENTICATED: unauthenticatedError,// @ts-ignore
        FAILED_PRECONDITION: failedPreconditionError,// @ts-ignore
        VALIDATION: validationError,// @ts-ignore
        UNAUTHORIZED: unauthorizedError,// @ts-ignore
        RESOURCE_NOT_FOUND: resourceNotFoundError,// @ts-ignore
    };

    /**
     * @param _key
     * @param _error
     * @param _metadata
     * @param _details
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
     * @param _key
     * @param _source
     * @param _metadata
     * @param _details
     */
    public THROW({
                     _key,
                     _source = null,
                     _metadata = null,
                     _details = null,
                 }: I_THROW<T>
    ): ServerErrorResponse {
        console.log(_source ? `[ Emitting GRPC ERROR: [ ${_key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${_key} ] ]`);
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        return _error;
    }

    /**
     * @param _call
     * @param _key
     * @param _source
     * @param _metadata
     * @param _details
     */
    public EMIT({
                    _call,
                    _key,
                    _source = null,
                    _metadata = null,
                    _details = null,
                }: I_EMIT<T>
    ): void {
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        _call.emit('error', _error)
        return console.log(_source ? `[ Emitting GRPC ERROR: [ ${_key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${_key} ] ]`);
    }

    /**
     * @param _callback
     * @param _key
     * @param _source
     * @param _metadata
     * @param _details
     */
    public CALLBACK({
                        _callback,
                        _key,
                        _source = null,
                        _metadata = null,
                        _details = null,
                    }: I_CALLBACK<T>
    ): void {
        const _error = this.ERRORS[_key];
        if (_metadata) _error.metadata = _metadata;
        if (_details) _error.details = _details;
        _callback(_error)
        return console.log(_source ? `[ Emitting GRPC ERROR: [ ${_key} ] from "${_source}" ]` : `[ Emitting ERROR: [ ${_key} ] ]`);
    }

    /**
     * @param error
     */
    public handleZodError(error: ZodError): ServerErrorResponse { // @ts-ignore
        const _error = this.ERRORS.VALIDATION_ERROR ;
        const _metadata = new Metadata();
        error.errors.forEach((e: ZodIssue, i: number) => {
            _metadata.set(`error_${i}`, e.message);
        });
        _error.metadata = _metadata;
        _error.details = error.errors.map((e) => e.message).join(', ');
        return _error;
    }

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

export interface I_EXTEND<T extends string> {
    _key: T;
    _error: ServerErrorResponse;
    _metadata: null | Metadata;
    _details: string | null;
}

export interface I_THROW<T extends string> {
    _key: T;
    _source: string | null;
    _metadata: null | Metadata;
    _details: string | null;
}

export interface I_EMIT<T extends string> {
    _call: ServerWritableStream<any, any>;
    _key: T;
    _source: string | null;
    _metadata: null | Metadata;
    _details: string | null;
}

export interface I_CALLBACK<T extends string> {
    _callback: sendUnaryData<any>;
    _key: T;
    _source: string | null;
    _metadata: null | Metadata;
    _details: string | null;
}

interface IGrpcErrors<T extends string> {
    ERRORS: Record<T, ServerErrorResponse>;

    EXTEND({
               _key,
               _error,
               _metadata,
               _details,
           }: I_EXTEND<T >): void;

    THROW({
              _key,
              _source,
              _metadata,
              _details,
          }: I_THROW<T >): ServerErrorResponse;

    EMIT({
             _call,
             _key,
             _source,
             _metadata,
             _details,
         }: I_EMIT<T >): void;

    CALLBACK({
                 _callback,
                 _key,
                 _source,
                 _metadata,
                 _details,
             }: I_CALLBACK<T >): void;

    handleZodError(error: ZodError): ServerErrorResponse;
}
