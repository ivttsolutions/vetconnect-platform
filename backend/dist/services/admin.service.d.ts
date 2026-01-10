export declare class AdminService {
    getStats(): Promise<{
        users: {
            total: number;
            active: number;
        };
        posts: {
            total: number;
        };
        jobs: {
            total: number;
            active: number;
        };
        events: {
            total: number;
            upcoming: number;
        };
        connections: {
            total: number;
        };
    }>;
    getUsers(options: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        userType?: string;
    }): Promise<{
        users: {
            id: string;
            email: string;
            userType: import(".prisma/client").$Enums.UserType;
            status: import(".prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            name: string;
            avatar: string;
            postsCount: number;
            connectionsCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateUserStatus(userId: string, status: string): Promise<{
        id: string;
        email: string;
        password: string;
        userType: import(".prisma/client").$Enums.UserType;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.AccountStatus;
        emailVerified: boolean;
        emailVerifiedAt: Date | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        lastLoginAt: Date | null;
        lastActiveAt: Date | null;
        loginCount: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deleteUser(userId: string): Promise<{
        id: string;
        email: string;
        password: string;
        userType: import(".prisma/client").$Enums.UserType;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.AccountStatus;
        emailVerified: boolean;
        emailVerifiedAt: Date | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        lastLoginAt: Date | null;
        lastActiveAt: Date | null;
        loginCount: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getPosts(options: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        posts: {
            id: string;
            content: string;
            createdAt: Date;
            authorName: string;
            authorId: string;
            likesCount: number;
            commentsCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    deletePost(postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        documents: string[];
        type: import(".prisma/client").$Enums.PostType;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        content: string | null;
        images: string[];
        videos: string[];
        articleTitle: string | null;
        articleCover: string | null;
        articleContent: string | null;
        caseTitle: string | null;
        casePresentation: string | null;
        caseDiagnosis: string | null;
        caseTreatment: string | null;
        caseEvolution: string | null;
        pollQuestion: string | null;
        pollOptions: string[];
        pollEndDate: Date | null;
        hashtags: string[];
        mentions: string[];
        likesCount: number;
        commentsCount: number;
        sharesCount: number;
        viewsCount: number;
        isReported: boolean;
        isHidden: boolean;
        authorId: string;
        eventId: string | null;
    }>;
    getJobs(options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        jobs: {
            id: string;
            title: string;
            company: string;
            status: import(".prisma/client").$Enums.JobStatus;
            createdAt: Date;
            applicationsCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateJobStatus(jobId: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        specialization: string[];
        country: string | null;
        city: string | null;
        skills: string[];
        description: string;
        title: string;
        location: string;
        viewsCount: number;
        requirements: string;
        responsibilities: string;
        benefits: string | null;
        jobType: import(".prisma/client").$Enums.JobType;
        remote: boolean;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        showSalary: boolean;
        experienceYears: number | null;
        educationLevel: string | null;
        applicationDeadline: Date | null;
        externalUrl: string | null;
        applicationEmail: string | null;
        applicationsCount: number;
        isSponsored: boolean;
        sponsoredUntil: Date | null;
        publishedAt: Date | null;
        closedAt: Date | null;
        companyId: string;
    }>;
    getEvents(options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        events: {
            id: string;
            title: string;
            organizer: string;
            status: import(".prisma/client").$Enums.EventStatus;
            startDate: Date;
            registrationsCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateEventStatus(eventId: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        country: string | null;
        city: string | null;
        address: string | null;
        timezone: string;
        description: string;
        mode: import(".prisma/client").$Enums.EventMode;
        startDate: Date;
        title: string;
        location: string | null;
        endDate: Date;
        type: import(".prisma/client").$Enums.EventType;
        viewsCount: number;
        isSponsored: boolean;
        sponsoredUntil: Date | null;
        publishedAt: Date | null;
        coverImage: string | null;
        coordinates: string | null;
        onlineUrl: string | null;
        agenda: import("@prisma/client/runtime/library").JsonValue | null;
        speakers: import("@prisma/client/runtime/library").JsonValue[];
        sponsors: import("@prisma/client/runtime/library").JsonValue[];
        isFree: boolean;
        price: import("@prisma/client/runtime/library").Decimal | null;
        currency: string;
        maxAttendees: number | null;
        registrationDeadline: Date | null;
        requiresApproval: boolean;
        customQuestions: import("@prisma/client/runtime/library").JsonValue[];
        materials: string[];
        recordingUrl: string | null;
        registrationsCount: number;
        attendeesCount: number;
        organizerId: string;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map