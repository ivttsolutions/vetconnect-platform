"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'No autorizado' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user || user.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol de administrador.' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error de autorización' });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=admin.middleware.js.map