"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        // Hash password
        const hashedPassword = await (0, password_util_1.hashPassword)(data.password);
        // Create user and profile in a transaction
        const user = await prisma_1.default.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    userType: data.userType,
                    status: 'PENDING_VERIFICATION',
                },
            });
            // Create user profile (only for USER and SHELTER types)
            if (data.userType === 'USER' || data.userType === 'SHELTER') {
                await tx.userProfile.create({
                    data: {
                        userId: newUser.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                    },
                });
            }
            return newUser;
        });
        // Generate tokens
        const accessToken = (0, jwt_util_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_util_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Save refresh token
        await prisma_1.default.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                userType: user.userType,
                role: user.role,
                status: user.status,
            },
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        // Find user
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
            include: {
                userProfile: true,
            },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Check password
        const isPasswordValid = await (0, password_util_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Check if account is active
        if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
            throw new Error('Account is not active');
        }
        // Generate tokens
        const accessToken = (0, jwt_util_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_util_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Save refresh token
        await prisma_1.default.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        // Update last login
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                loginCount: { increment: 1 },
            },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                userType: user.userType,
                role: user.role,
                status: user.status,
                profile: user.userProfile,
            },
            accessToken,
            refreshToken,
        };
    }
    async refreshAccessToken(refreshToken) {
        // Find refresh token
        const storedToken = await prisma_1.default.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!storedToken) {
            throw new Error('Invalid refresh token');
        }
        // Check if expired
        if (storedToken.expiresAt < new Date()) {
            await prisma_1.default.refreshToken.delete({
                where: { id: storedToken.id },
            });
            throw new Error('Refresh token expired');
        }
        // Generate new access token
        const accessToken = (0, jwt_util_1.generateAccessToken)({
            userId: storedToken.user.id,
            email: storedToken.user.email,
            role: storedToken.user.role,
        });
        return { accessToken };
    }
    async logout(refreshToken) {
        await prisma_1.default.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map