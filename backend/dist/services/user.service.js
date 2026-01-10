"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserService {
    async getProfile(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                userProfile: true,
                companyProfile: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Remove sensitive data
        const { password, twoFactorSecret, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { userProfile: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.userProfile) {
            throw new Error('User profile not found');
        }
        const updatedProfile = await prisma_1.default.userProfile.update({
            where: { userId },
            data,
        });
        return updatedProfile;
    }
    async getUserById(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                userProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        headline: true,
                        bio: true,
                        specialization: true,
                        yearsOfExperience: true,
                        country: true,
                        city: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { password, twoFactorSecret, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async searchUsers(query, limit = 10) {
        const users = await prisma_1.default.user.findMany({
            where: {
                OR: [
                    { email: { contains: query, mode: 'insensitive' } },
                    {
                        userProfile: {
                            OR: [
                                { firstName: { contains: query, mode: 'insensitive' } },
                                { lastName: { contains: query, mode: 'insensitive' } },
                            ],
                        },
                    },
                ],
                status: 'ACTIVE',
            },
            take: limit,
            include: {
                userProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        headline: true,
                    },
                },
            },
        });
        return users.map(user => {
            const { password, twoFactorSecret, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map