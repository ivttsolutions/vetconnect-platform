import { Router } from 'express';
import { JobsController } from '../controllers/jobs.controller';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const jobsController = new JobsController();

// Rutas públicas (con auth opcional para estado de aplicación)
router.get('/', optionalAuth, (req, res) => jobsController.getJobs(req, res));
router.get('/:jobId', optionalAuth, (req, res) => jobsController.getJob(req, res));

// Rutas protegidas
router.post('/', authMiddleware, (req, res) => jobsController.createJob(req, res));
router.post('/:jobId/apply', authMiddleware, (req, res) => jobsController.applyToJob(req, res));
router.post('/:jobId/save', authMiddleware, (req, res) => jobsController.saveJob(req, res));
router.post('/:jobId/close', authMiddleware, (req, res) => jobsController.closeJob(req, res));

// Mis empleos y aplicaciones
router.get('/my/saved', authMiddleware, (req, res) => jobsController.getSavedJobs(req, res));
router.get('/my/applications', authMiddleware, (req, res) => jobsController.getMyApplications(req, res));
router.get('/my/posted', authMiddleware, (req, res) => jobsController.getCompanyJobs(req, res));

// Gestión de aplicaciones (para empresas)
router.get('/:jobId/applications', authMiddleware, (req, res) => jobsController.getJobApplications(req, res));
router.patch('/applications/:applicationId/status', authMiddleware, (req, res) => jobsController.updateApplicationStatus(req, res));

export default router;
