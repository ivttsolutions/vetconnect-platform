import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const message = handlePrismaError(err);
    error = new AppError(message, 400);
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    const message = 'Invalid data provided';
    error = new AppError(message, 400);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
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
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    const message = handleMulterError(err);
    error = new AppError(message, 400);
  }

  // Default error response
  const statusCode = (error as AppError).statusCode || 500;
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

/**
 * Handle Prisma errors
 */
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): string => {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (err.meta?.target as string[])?.[0] || 'field';
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
const handleMulterError = (err: any): string => {
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
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
