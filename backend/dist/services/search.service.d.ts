export declare class SearchService {
    searchAll(query: string, options?: {
        limit?: number;
    }): Promise<{
        users: {
            id: string;
            type: string;
            name: string;
            headline: string;
            avatar: string;
        }[];
        jobs: {
            id: string;
            title: string;
            company: string;
            city: string;
            remote: boolean;
            jobType: import(".prisma/client").$Enums.JobType;
        }[];
        events: {
            id: string;
            title: string;
            type: import(".prisma/client").$Enums.EventType;
            mode: import(".prisma/client").$Enums.EventMode;
            startDate: Date;
            city: string;
            organizer: string;
        }[];
        posts: {
            id: string;
            content: string;
            author: string;
            createdAt: Date;
        }[];
    }>;
    searchUsers(query: string, options?: {
        limit?: number;
        offset?: number;
        userType?: string;
    }): Promise<({
        userProfile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            coverPhoto: string | null;
            headline: string | null;
            bio: string | null;
            dateOfBirth: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            licenseNumber: string | null;
            specialization: string[];
            yearsOfExperience: number | null;
            phone: string | null;
            country: string | null;
            city: string | null;
            address: string | null;
            postalCode: string | null;
            website: string | null;
            linkedIn: string | null;
            twitter: string | null;
            instagram: string | null;
            showEmail: boolean;
            showPhone: boolean;
            searchableByLicense: boolean;
            openToOpportunities: boolean;
            preferredLanguage: string;
            timezone: string;
        };
        companyProfile: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            coverPhoto: string | null;
            phone: string | null;
            country: string | null;
            city: string | null;
            address: string | null;
            postalCode: string | null;
            website: string | null;
            linkedIn: string | null;
            twitter: string | null;
            instagram: string | null;
            preferredLanguage: string;
            certifications: string[];
            companyName: string;
            logo: string | null;
            description: string | null;
            companyType: import(".prisma/client").$Enums.CompanyType;
            taxId: string | null;
            foundedYear: number | null;
            employeeCount: string | null;
            services: string[];
            coverageArea: string[];
            facebook: string | null;
            youtube: string | null;
            isShelter: boolean;
            isVerifiedShelter: boolean;
            shelterCapacity: number | null;
            shelterType: string | null;
            gallery: string[];
        };
    } & {
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
    })[]>;
}
//# sourceMappingURL=search.service.d.ts.map