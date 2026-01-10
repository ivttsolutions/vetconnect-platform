"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
// Todas las rutas requieren autenticación y rol de admin
router.use(auth_middleware_1.authMiddleware);
router.use(admin_middleware_1.adminMiddleware);
// Estadísticas
router.get('/stats', (req, res) => adminController.getStats(req, res));
// Usuarios
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.patch('/users/:userId/status', (req, res) => adminController.updateUserStatus(req, res));
router.delete('/users/:userId', (req, res) => adminController.deleteUser(req, res));
// Posts
router.get('/posts', (req, res) => adminController.getPosts(req, res));
router.delete('/posts/:postId', (req, res) => adminController.deletePost(req, res));
// Empleos
router.get('/jobs', (req, res) => adminController.getJobs(req, res));
router.patch('/jobs/:jobId/status', (req, res) => adminController.updateJobStatus(req, res));
// Eventos
router.get('/events', (req, res) => adminController.getEvents(req, res));
router.patch('/events/:eventId/status', (req, res) => adminController.updateEventStatus(req, res));
exports.default = router;
//# sourceMappingURL=admin.routes.js.map