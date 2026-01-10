import { Response } from 'express';
import { JobsService } from '../services/jobs.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const jobsService = new JobsService();

export class JobsController {
  async getJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { limit, offset, jobType, location, remote, search } = req.query;
      
      const jobs = await jobsService.getJobs({
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
        jobType: jobType as string,
        location: location as string,
        remote: remote === 'true' ? true : remote === 'false' ? false : undefined,
        search: search as string,
      });
      
      sendSuccess(res, jobs, 'Empleos obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const userId = req.user?.userId;
      
      const job = await jobsService.getJob(jobId, userId);
      sendSuccess(res, job, 'Empleo obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async createJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const job = await jobsService.createJob(companyId, req.body);
      sendSuccess(res, job, 'Empleo publicado', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async applyToJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.params;
      const { coverLetter, resumeUrl } = req.body;
      
      const application = await jobsService.applyToJob(jobId, userId, { coverLetter, resumeUrl });
      sendSuccess(res, application, 'Aplicación enviada', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async saveJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.params;
      
      const result = await jobsService.saveJob(userId, jobId);
      sendSuccess(res, result, result.saved ? 'Empleo guardado' : 'Empleo eliminado de guardados');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getSavedJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const jobs = await jobsService.getSavedJobs(userId);
      sendSuccess(res, jobs, 'Empleos guardados obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getMyApplications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const applications = await jobsService.getMyApplications(userId);
      sendSuccess(res, applications, 'Aplicaciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getCompanyJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const jobs = await jobsService.getCompanyJobs(companyId);
      sendSuccess(res, jobs, 'Empleos de la empresa obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getJobApplications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const { jobId } = req.params;
      
      const applications = await jobsService.getJobApplications(jobId, companyId);
      sendSuccess(res, applications, 'Aplicaciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateApplicationStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const { applicationId } = req.params;
      const { status } = req.body;
      
      const application = await jobsService.updateApplicationStatus(applicationId, companyId, status);
      sendSuccess(res, application, 'Estado actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async closeJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const { jobId } = req.params;
      
      const job = await jobsService.closeJob(jobId, companyId);
      sendSuccess(res, job, 'Empleo cerrado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
