"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const jobs_service_1 = require("../services/jobs.service");
const response_util_1 = require("../utils/response.util");
const jobsService = new jobs_service_1.JobsService();
class JobsController {
    async getJobs(req, res) {
        try {
            const { limit, offset, jobType, location, remote, search } = req.query;
            const jobs = await jobsService.getJobs({
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
                jobType: jobType,
                location: location,
                remote: remote === 'true' ? true : remote === 'false' ? false : undefined,
                search: search,
            });
            (0, response_util_1.sendSuccess)(res, jobs, 'Empleos obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getJob(req, res) {
        try {
            const { jobId } = req.params;
            const userId = req.user?.userId;
            const job = await jobsService.getJob(jobId, userId);
            (0, response_util_1.sendSuccess)(res, job, 'Empleo obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async createJob(req, res) {
        try {
            const companyId = req.user.userId;
            const job = await jobsService.createJob(companyId, req.body);
            (0, response_util_1.sendSuccess)(res, job, 'Empleo publicado', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async applyToJob(req, res) {
        try {
            const userId = req.user.userId;
            const { jobId } = req.params;
            const { coverLetter, resumeUrl } = req.body;
            const application = await jobsService.applyToJob(jobId, userId, { coverLetter, resumeUrl });
            (0, response_util_1.sendSuccess)(res, application, 'Aplicación enviada', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async saveJob(req, res) {
        try {
            const userId = req.user.userId;
            const { jobId } = req.params;
            const result = await jobsService.saveJob(userId, jobId);
            (0, response_util_1.sendSuccess)(res, result, result.saved ? 'Empleo guardado' : 'Empleo eliminado de guardados');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getSavedJobs(req, res) {
        try {
            const userId = req.user.userId;
            const jobs = await jobsService.getSavedJobs(userId);
            (0, response_util_1.sendSuccess)(res, jobs, 'Empleos guardados obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getMyApplications(req, res) {
        try {
            const userId = req.user.userId;
            const applications = await jobsService.getMyApplications(userId);
            (0, response_util_1.sendSuccess)(res, applications, 'Aplicaciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getCompanyJobs(req, res) {
        try {
            const companyId = req.user.userId;
            const jobs = await jobsService.getCompanyJobs(companyId);
            (0, response_util_1.sendSuccess)(res, jobs, 'Empleos de la empresa obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getJobApplications(req, res) {
        try {
            const companyId = req.user.userId;
            const { jobId } = req.params;
            const applications = await jobsService.getJobApplications(jobId, companyId);
            (0, response_util_1.sendSuccess)(res, applications, 'Aplicaciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateApplicationStatus(req, res) {
        try {
            const companyId = req.user.userId;
            const { applicationId } = req.params;
            const { status } = req.body;
            const application = await jobsService.updateApplicationStatus(applicationId, companyId, status);
            (0, response_util_1.sendSuccess)(res, application, 'Estado actualizado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async closeJob(req, res) {
        try {
            const companyId = req.user.userId;
            const { jobId } = req.params;
            const job = await jobsService.closeJob(jobId, companyId);
            (0, response_util_1.sendSuccess)(res, job, 'Empleo cerrado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=jobs.controller.js.map