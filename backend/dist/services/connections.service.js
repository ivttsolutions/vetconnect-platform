"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ConnectionService {
    // Enviar solicitud de conexión
    async sendRequest(senderId, receiverId, message) {
        if (senderId === receiverId) {
            throw new Error('No puedes conectar contigo mismo');
        }
        // Verificar si ya existe una conexión
        const existing = await prisma_1.default.connection.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });
        if (existing) {
            if (existing.status === 'ACCEPTED') {
                throw new Error('Ya estás conectado con este usuario');
            }
            if (existing.status === 'PENDING') {
                throw new Error('Ya existe una solicitud pendiente');
            }
            if (existing.status === 'BLOCKED') {
                throw new Error('No puedes enviar solicitud a este usuario');
            }
        }
        const connection = await prisma_1.default.connection.create({
            data: {
                senderId,
                receiverId,
                message,
                status: 'PENDING',
            },
            include: {
                receiver: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
        return connection;
    }
    // Aceptar solicitud
    async acceptRequest(connectionId, userId) {
        const connection = await prisma_1.default.connection.findUnique({
            where: { id: connectionId },
        });
        if (!connection) {
            throw new Error('Solicitud no encontrada');
        }
        if (connection.receiverId !== userId) {
            throw new Error('No tienes permiso para aceptar esta solicitud');
        }
        if (connection.status !== 'PENDING') {
            throw new Error('Esta solicitud ya fue procesada');
        }
        const updated = await prisma_1.default.connection.update({
            where: { id: connectionId },
            data: { status: 'ACCEPTED' },
            include: {
                sender: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
        return updated;
    }
    // Rechazar solicitud
    async rejectRequest(connectionId, userId) {
        const connection = await prisma_1.default.connection.findUnique({
            where: { id: connectionId },
        });
        if (!connection) {
            throw new Error('Solicitud no encontrada');
        }
        if (connection.receiverId !== userId) {
            throw new Error('No tienes permiso para rechazar esta solicitud');
        }
        await prisma_1.default.connection.update({
            where: { id: connectionId },
            data: { status: 'REJECTED' },
        });
        return { rejected: true };
    }
    // Cancelar solicitud enviada
    async cancelRequest(connectionId, userId) {
        const connection = await prisma_1.default.connection.findUnique({
            where: { id: connectionId },
        });
        if (!connection) {
            throw new Error('Solicitud no encontrada');
        }
        if (connection.senderId !== userId) {
            throw new Error('No tienes permiso para cancelar esta solicitud');
        }
        if (connection.status !== 'PENDING') {
            throw new Error('Solo puedes cancelar solicitudes pendientes');
        }
        await prisma_1.default.connection.delete({
            where: { id: connectionId },
        });
        return { cancelled: true };
    }
    // Eliminar conexión
    async removeConnection(connectionId, userId) {
        const connection = await prisma_1.default.connection.findUnique({
            where: { id: connectionId },
        });
        if (!connection) {
            throw new Error('Conexión no encontrada');
        }
        if (connection.senderId !== userId && connection.receiverId !== userId) {
            throw new Error('No tienes permiso para eliminar esta conexión');
        }
        await prisma_1.default.connection.delete({
            where: { id: connectionId },
        });
        return { removed: true };
    }
    // Obtener solicitudes pendientes recibidas
    async getPendingRequests(userId) {
        return prisma_1.default.connection.findMany({
            where: {
                receiverId: userId,
                status: 'PENDING',
            },
            include: {
                sender: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Obtener solicitudes enviadas
    async getSentRequests(userId) {
        return prisma_1.default.connection.findMany({
            where: {
                senderId: userId,
                status: 'PENDING',
            },
            include: {
                receiver: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Obtener conexiones aceptadas
    async getConnections(userId, options = {}) {
        const limit = options.limit || 50;
        const offset = options.offset || 0;
        const connections = await prisma_1.default.connection.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                receiver: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
            take: limit,
            skip: offset,
        });
        // Retornar el usuario conectado (no el actual)
        return connections.map(conn => ({
            id: conn.id,
            connectedAt: conn.updatedAt,
            user: conn.senderId === userId ? conn.receiver : conn.sender,
        }));
    }
    // Contar conexiones
    async getConnectionsCount(userId) {
        return prisma_1.default.connection.count({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
        });
    }
    // Verificar estado de conexión entre dos usuarios
    async getConnectionStatus(userId, targetUserId) {
        const connection = await prisma_1.default.connection.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: targetUserId },
                    { senderId: targetUserId, receiverId: userId },
                ],
            },
        });
        if (!connection) {
            return { status: 'NONE', connectionId: null };
        }
        return {
            status: connection.status,
            connectionId: connection.id,
            isSender: connection.senderId === userId,
        };
    }
    // Buscar usuarios para conectar
    async searchUsers(userId, query, options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const users = await prisma_1.default.user.findMany({
            where: {
                id: { not: userId },
                status: 'ACTIVE',
                OR: [
                    {
                        userProfile: {
                            OR: [
                                { firstName: { contains: query, mode: 'insensitive' } },
                                { lastName: { contains: query, mode: 'insensitive' } },
                                { headline: { contains: query, mode: 'insensitive' } },
                            ],
                        },
                    },
                    {
                        companyProfile: {
                            companyName: { contains: query, mode: 'insensitive' },
                        },
                    },
                    {
                        email: { contains: query, mode: 'insensitive' },
                    },
                ],
            },
            include: {
                userProfile: true,
                companyProfile: true,
            },
            take: limit,
            skip: offset,
        });
        // Agregar estado de conexión a cada usuario
        const usersWithStatus = await Promise.all(users.map(async (user) => {
            const connectionStatus = await this.getConnectionStatus(userId, user.id);
            return {
                ...user,
                connectionStatus: connectionStatus.status,
                connectionId: connectionStatus.connectionId,
            };
        }));
        return usersWithStatus;
    }
    // Sugerencias de conexión
    async getSuggestions(userId, limit = 10) {
        // Obtener IDs de usuarios ya conectados o con solicitudes
        const existingConnections = await prisma_1.default.connection.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            select: {
                senderId: true,
                receiverId: true,
            },
        });
        const excludeIds = new Set([userId]);
        existingConnections.forEach(conn => {
            excludeIds.add(conn.senderId);
            excludeIds.add(conn.receiverId);
        });
        // Obtener usuarios sugeridos (por ahora, usuarios recientes activos)
        const suggestions = await prisma_1.default.user.findMany({
            where: {
                id: { notIn: Array.from(excludeIds) },
                status: 'ACTIVE',
                OR: [
                    { userProfile: { isNot: null } },
                    { companyProfile: { isNot: null } },
                ],
            },
            include: {
                userProfile: true,
                companyProfile: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return suggestions;
    }
}
exports.ConnectionService = ConnectionService;
//# sourceMappingURL=connections.service.js.map