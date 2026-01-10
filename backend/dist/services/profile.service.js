"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ProfileService {
    async getUserProfile(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                userProfile: {
                    include: {
                        experiences: { orderBy: { startDate: 'desc' } },
                        educations: { orderBy: { startDate: 'desc' } },
                        certifications: { orderBy: { issueDate: 'desc' } },
                        skills: { orderBy: { endorsements: 'desc' } },
                        languages: true,
                        publications: { orderBy: { publicationDate: 'desc' } },
                    },
                },
                companyProfile: {
                    include: {
                        teamMembers: true,
                    },
                },
                _count: {
                    select: {
                        posts: true,
                        sentConnections: { where: { status: 'ACCEPTED' } },
                        receivedConnections: { where: { status: 'ACCEPTED' } },
                        followers: true,
                        following: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getPublicProfile(userId, viewerId) {
        const profile = await this.getUserProfile(userId);
        // Record profile view
        if (viewerId && viewerId !== userId) {
            await prisma_1.default.profileView.create({
                data: {
                    profileId: userId,
                    viewerId,
                },
            });
        }
        return profile;
    }
    async updateUserProfile(userId, data) {
        const profile = await prisma_1.default.userProfile.update({
            where: { userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                headline: data.headline,
                bio: data.bio,
                phone: data.phone,
                country: data.country,
                city: data.city,
                address: data.address,
                postalCode: data.postalCode,
                website: data.website,
                linkedIn: data.linkedIn,
                twitter: data.twitter,
                instagram: data.instagram,
                specialization: data.specialization,
                yearsOfExperience: data.yearsOfExperience,
                licenseNumber: data.licenseNumber,
                showEmail: data.showEmail,
                showPhone: data.showPhone,
                openToOpportunities: data.openToOpportunities,
            },
        });
        return profile;
    }
    async updateAvatar(userId, avatarUrl) {
        return prisma_1.default.userProfile.update({
            where: { userId },
            data: { avatar: avatarUrl },
        });
    }
    async updateCover(userId, coverUrl) {
        return prisma_1.default.userProfile.update({
            where: { userId },
            data: { coverPhoto: coverUrl },
        });
    }
    // Experience CRUD
    async addExperience(userId, data) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        return prisma_1.default.experience.create({
            data: {
                userProfileId: profile.id,
                title: data.title,
                companyName: data.companyName,
                location: data.location,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                current: data.current || false,
                description: data.description,
            },
        });
    }
    async updateExperience(experienceId, userId, data) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const experience = await prisma_1.default.experience.findFirst({
            where: { id: experienceId, userProfileId: profile.id },
        });
        if (!experience)
            throw new Error('Experience not found');
        return prisma_1.default.experience.update({
            where: { id: experienceId },
            data: {
                title: data.title,
                companyName: data.companyName,
                location: data.location,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                current: data.current || false,
                description: data.description,
            },
        });
    }
    async deleteExperience(experienceId, userId) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const experience = await prisma_1.default.experience.findFirst({
            where: { id: experienceId, userProfileId: profile.id },
        });
        if (!experience)
            throw new Error('Experience not found');
        return prisma_1.default.experience.delete({ where: { id: experienceId } });
    }
    // Education CRUD
    async addEducation(userId, data) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        return prisma_1.default.education.create({
            data: {
                userProfileId: profile.id,
                institution: data.institution,
                degree: data.degree,
                fieldOfStudy: data.fieldOfStudy,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                current: data.current || false,
                description: data.description,
            },
        });
    }
    async updateEducation(educationId, userId, data) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const education = await prisma_1.default.education.findFirst({
            where: { id: educationId, userProfileId: profile.id },
        });
        if (!education)
            throw new Error('Education not found');
        return prisma_1.default.education.update({
            where: { id: educationId },
            data: {
                institution: data.institution,
                degree: data.degree,
                fieldOfStudy: data.fieldOfStudy,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                current: data.current || false,
                description: data.description,
            },
        });
    }
    async deleteEducation(educationId, userId) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const education = await prisma_1.default.education.findFirst({
            where: { id: educationId, userProfileId: profile.id },
        });
        if (!education)
            throw new Error('Education not found');
        return prisma_1.default.education.delete({ where: { id: educationId } });
    }
    // Skills CRUD
    async addSkill(userId, name) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const existingSkill = await prisma_1.default.skill.findFirst({
            where: { userProfileId: profile.id, name },
        });
        if (existingSkill)
            throw new Error('Skill already exists');
        return prisma_1.default.skill.create({
            data: {
                userProfileId: profile.id,
                name,
            },
        });
    }
    async deleteSkill(skillId, userId) {
        const profile = await prisma_1.default.userProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error('Profile not found');
        const skill = await prisma_1.default.skill.findFirst({
            where: { id: skillId, userProfileId: profile.id },
        });
        if (!skill)
            throw new Error('Skill not found');
        return prisma_1.default.skill.delete({ where: { id: skillId } });
    }
    // Search profiles
    async searchProfiles(query, filters) {
        const where = {
            OR: [
                { userProfile: { firstName: { contains: query, mode: 'insensitive' } } },
                { userProfile: { lastName: { contains: query, mode: 'insensitive' } } },
                { userProfile: { headline: { contains: query, mode: 'insensitive' } } },
                { companyProfile: { companyName: { contains: query, mode: 'insensitive' } } },
            ],
            status: 'ACTIVE',
        };
        if (filters?.userType) {
            where.userType = filters.userType;
        }
        if (filters?.country) {
            where.OR = [
                { userProfile: { country: filters.country } },
                { companyProfile: { country: filters.country } },
            ];
        }
        const users = await prisma_1.default.user.findMany({
            where,
            include: {
                userProfile: true,
                companyProfile: true,
            },
            take: filters?.limit || 20,
            skip: filters?.offset || 0,
        });
        return users;
    }
}
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map