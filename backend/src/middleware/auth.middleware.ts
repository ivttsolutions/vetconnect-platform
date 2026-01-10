import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { AuthRequest } from '../types';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return new Promise((resolve) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      resolve();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
      resolve();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      resolve();
    }
  });
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return new Promise((resolve) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      resolve();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Token invalid, but continue without user
    }

    next();
    resolve();
  });
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};
