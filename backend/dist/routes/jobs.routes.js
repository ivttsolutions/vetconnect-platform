"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobs_controller_1 = require("../controllers/jobs.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const jobsController = new jobs_controller_1.JobsController();
// Rutas públicas (con auth opcional para estado de aplicación)
router.get('/', auth_middleware_1.optionalAuth, (req, res) => jobsController.getJobs(req, res));
router.get('/:jobId', auth_middleware_1.optionalAuth, (req, res) => jobsController.getJob(req, res));
// Rutas protegidas
router.post('/', auth_middleware_1.authMiddleware, (req, res) => jobsController.createJob(req, res));
router.post('/:jobId/apply', auth_middleware_1.authMiddleware, (req, res) => jobsController.applyToJob(req, res));
router.post('/:jobId/save', auth_middleware_1.authMiddleware, (req, res) => jobsController.saveJob(req, res));
router.post('/:jobId/close', auth_middleware_1.authMiddleware, (req, res) => jobsController.closeJob(req, res));
// Mis empleos y aplicaciones
router.get('/my/saved', auth_middleware_1.authMiddleware, (req, res) => jobsController.getSavedJobs(req, res));
router.get('/my/applications', auth_middleware_1.authMiddleware, (req, res) => jobsController.getMyApplications(req, res));
router.get('/my/posted', auth_middleware_1.authMiddleware, (req, res) => jobsController.getCompanyJobs(req, res));
// Gestión de aplicaciones (para empresas)
router.get('/:jobId/applications', auth_middleware_1.authMiddleware, (req, res) => jobsController.getJobApplications(req, res));
router.patch('/applications/:applicationId/status', auth_middleware_1.authMiddleware, (req, res) => jobsController.updateApplicationStatus(req, res));
exports.default = router;
//# sourceMappingURL=jobs.routes.js.map