"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const authenticate = (req, res, next) => {
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
            const decoded = (0, jwt_util_1.verifyAccessToken)(token);
            req.user = decoded;
            next();
            resolve();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token',
            });
            resolve();
        }
    });
};
exports.authenticate = authenticate;
const optionalAuth = (req, res, next) => {
    return new Promise((resolve) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            resolve();
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = (0, jwt_util_1.verifyAccessToken)(token);
            req.user = decoded;
        }
        catch (error) {
            // Token invalid, but continue without user
        }
        next();
        resolve();
    });
};
exports.optionalAuth = optionalAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
//# sourceMappingURL=auth.middleware.js.map