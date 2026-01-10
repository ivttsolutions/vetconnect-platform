"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = require("../controllers/events.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const eventsController = new events_controller_1.EventsController();
// Rutas públicas
router.get('/', auth_middleware_1.optionalAuth, (req, res) => eventsController.getEvents(req, res));
router.get('/:eventId', auth_middleware_1.optionalAuth, (req, res) => eventsController.getEvent(req, res));
// Rutas protegidas
router.post('/', auth_middleware_1.authMiddleware, (req, res) => eventsController.createEvent(req, res));
router.post('/:eventId/register', auth_middleware_1.authMiddleware, (req, res) => eventsController.registerToEvent(req, res));
router.post('/:eventId/cancel-registration', auth_middleware_1.authMiddleware, (req, res) => eventsController.cancelRegistration(req, res));
router.post('/:eventId/cancel', auth_middleware_1.authMiddleware, (req, res) => eventsController.cancelEvent(req, res));
// Mis eventos
router.get('/my/registrations', auth_middleware_1.authMiddleware, (req, res) => eventsController.getMyRegistrations(req, res));
router.get('/my/organized', auth_middleware_1.authMiddleware, (req, res) => eventsController.getMyOrganizedEvents(req, res));
// Gestión de asistentes
router.get('/:eventId/attendees', auth_middleware_1.authMiddleware, (req, res) => eventsController.getEventAttendees(req, res));
router.patch('/registrations/:registrationId/status', auth_middleware_1.authMiddleware, (req, res) => eventsController.updateRegistrationStatus(req, res));
exports.default = router;
//# sourceMappingURL=events.routes.js.map