/**
 * Base Application Error class
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
/**
 * Bad Request Error (400)
 */
export declare class BadRequestError extends AppError {
    constructor(message?: string);
}
/**
 * Unauthorized Error (401)
 */
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
/**
 * Forbidden Error (403)
 */
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
/**
 * Not Found Error (404)
 */
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
/**
 * Conflict Error (409)
 */
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
/**
 * Validation Error (422)
 */
export declare class ValidationError extends AppError {
    readonly errors: any[];
    constructor(message?: string, errors?: any[]);
}
/**
 * Internal Server Error (500)
 */
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
/**
 * Service Unavailable Error (503)
 */
export declare class ServiceUnavailableError extends AppError {
    constructor(message?: string);
}
/**
 * Too Many Requests Error (429)
 */
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map