"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const response_util_1 = require("../utils/response.util");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_util_1.sendError)(res, 'No token provided', 401);
            return;
        }
        const token = authHeader.substring(7);
        try {
            const decoded = (0, jwt_util_1.verifyAccessToken)(token);
            req.user = decoded;
            next();
        }
        catch (error) {
            (0, response_util_1.sendError)(res, 'Invalid or expired token', 401);
            return;
        }
    }
    catch (error) {
        (0, response_util_1.sendError)(res, 'Authentication failed', 500);
        return;
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_util_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, response_util_1.sendError)(res, 'Insufficient permissions', 403);
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map