"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connections_controller_1 = require("../controllers/connections.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const connectionController = new connections_controller_1.ConnectionController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authMiddleware);
// Enviar solicitud de conexión
router.post('/request', (req, res) => connectionController.sendRequest(req, res));
// Aceptar solicitud
router.post('/:connectionId/accept', (req, res) => connectionController.acceptRequest(req, res));
// Rechazar solicitud
router.post('/:connectionId/reject', (req, res) => connectionController.rejectRequest(req, res));
// Cancelar solicitud enviada
router.delete('/:connectionId/cancel', (req, res) => connectionController.cancelRequest(req, res));
// Eliminar conexión existente
router.delete('/:connectionId', (req, res) => connectionController.removeConnection(req, res));
// Obtener solicitudes pendientes recibidas
router.get('/pending', (req, res) => connectionController.getPendingRequests(req, res));
// Obtener solicitudes enviadas
router.get('/sent', (req, res) => connectionController.getSentRequests(req, res));
// Obtener mis conexiones
router.get('/', (req, res) => connectionController.getConnections(req, res));
// Contar mis conexiones
router.get('/count', (req, res) => connectionController.getConnectionsCount(req, res));
// Verificar estado de conexión con otro usuario
router.get('/status/:targetUserId', (req, res) => connectionController.getConnectionStatus(req, res));
// Buscar usuarios
router.get('/search', (req, res) => connectionController.searchUsers(req, res));
// Obtener sugerencias de conexión
router.get('/suggestions', (req, res) => connectionController.getSuggestions(req, res));
exports.default = router;
//# sourceMappingURL=connections.routes.js.map