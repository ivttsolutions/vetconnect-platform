"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    logger_1.default.error(err);
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const message = handlePrismaError(err);
        error = new errors_1.AppError(message, 400);
    }
    // Prisma validation errors
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const message = 'Invalid data provided';
        error = new errors_1.AppError(message, 400);
    }
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const message = 'Validation failed';
        return res.status(422).json({
            success: false,
            message,
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new errors_1.AppError(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new errors_1.AppError(message, 401);
    }
    // Multer errors (file upload)
    if (err.name === 'MulterError') {
        const message = handleMulterError(err);
        error = new errors_1.AppError(message, 400);
    }
    // Default error response
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err,
        }),
    });
};
exports.errorHandler = errorHandler;
/**
 * Handle Prisma errors
 */
const handlePrismaError = (err) => {
    switch (err.code) {
        case 'P2002':
            // Unique constraint violation
            const field = err.meta?.target?.[0] || 'field';
            return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        case 'P2025':
            // Record not found
            return 'Resource not found';
        case 'P2003':
            // Foreign key constraint violation
            return 'Related resource not found';
        case 'P2014':
            // Invalid ID
            return 'Invalid ID provided';
        default:
            return 'Database error occurred';
    }
};
/**
 * Handle Multer errors
 */
const handleMulterError = (err) => {
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            return 'File size too large';
        case 'LIMIT_FILE_COUNT':
            return 'Too many files';
        case 'LIMIT_UNEXPECTED_FILE':
            return 'Unexpected file field';
        default:
            return 'File upload error';
    }
};
/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
    const error = new errors_1.AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map