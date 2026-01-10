import { RegisterDto, LoginDto } from '../types';
export declare class AuthService {
    register(data: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            userType: import(".prisma/client").$Enums.UserType;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.AccountStatus;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            userType: import(".prisma/client").$Enums.UserType;
            role: import(".prisma/client").$Enums.UserRole;
            status: "ACTIVE" | "PENDING_VERIFICATION";
            profile: {
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
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map