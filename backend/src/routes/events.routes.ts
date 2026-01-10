import { Router } from 'express';
import { EventsController } from '../controllers/events.controller';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const eventsController = new EventsController();

// Rutas públicas
router.get('/', optionalAuth, (req, res) => eventsController.getEvents(req, res));
router.get('/:eventId', optionalAuth, (req, res) => eventsController.getEvent(req, res));

// Rutas protegidas
router.post('/', authMiddleware, (req, res) => eventsController.createEvent(req, res));
router.post('/:eventId/register', authMiddleware, (req, res) => eventsController.registerToEvent(req, res));
router.post('/:eventId/cancel-registration', authMiddleware, (req, res) => eventsController.cancelRegistration(req, res));
router.post('/:eventId/cancel', authMiddleware, (req, res) => eventsController.cancelEvent(req, res));

// Mis eventos
router.get('/my/registrations', authMiddleware, (req, res) => eventsController.getMyRegistrations(req, res));
router.get('/my/organized', authMiddleware, (req, res) => eventsController.getMyOrganizedEvents(req, res));

// Gestión de asistentes
router.get('/:eventId/attendees', authMiddleware, (req, res) => eventsController.getEventAttendees(req, res));
router.patch('/registrations/:registrationId/status', authMiddleware, (req, res) => eventsController.updateRegistrationStatus(req, res));

export default router;
