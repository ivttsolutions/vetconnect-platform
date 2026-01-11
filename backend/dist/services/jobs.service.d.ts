export declare class JobsService {
    createJob(companyId: string, data: {
        title: string;
        description: string;
        requirements: string;
        responsibilities: string;
        benefits?: string;
        jobType: string;
        location: string;
        country?: string;
        city?: string;
        remote?: boolean;
        salaryMin?: number;
        salaryMax?: number;
        salaryCurrency?: string;
        showSalary?: boolean;
        experienceYears?: number;
        specialization?: string[];
        skills?: string[];
        educationLevel?: string;
        applicationDeadline?: Date;
        externalUrl?: string;
        applicationEmail?: string;
    }): Promise<any>;
    getJobs(options?: {
        limit?: number;
        offset?: number;
        jobType?: string;
        location?: string;
        remote?: boolean;
        search?: string;
    }): Promise<any>;
    getJob(jobId: string, userId?: string): Promise<any>;
    applyToJob(jobId: string, applicantId: string, data: {
        coverLetter?: string;
        resumeUrl?: string;
    }): Promise<any>;
    saveJob(userId: string, jobId: string): Promise<{
        saved: boolean;
    }>;
    getSavedJobs(userId: string): Promise<any>;
    getMyApplications(userId: string): Promise<any>;
    getCompanyJobs(companyId: string): Promise<any>;
    getJobApplications(jobId: string, companyId: string): Promise<any>;
    updateApplicationStatus(applicationId: string, companyId: string, status: string): Promise<any>;
    closeJob(jobId: string, companyId: string): Promise<any>;
}
//# sourceMappingURL=jobs.service.d.ts.map