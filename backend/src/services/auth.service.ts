import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { RegisterDto, LoginDto } from '../types';

export class AuthService {
  async register(data: RegisterDto) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Determine if this is a company/shelter registration
    const isCompanyOrShelter = data.userType === 'COMPANY' || data.userType === 'SHELTER';

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          userType: data.userType as any,
          status: 'PENDING_VERIFICATION',
        },
      });

      // Create appropriate profile based on user type
      if (isCompanyOrShelter) {
        // Create company profile for COMPANY or SHELTER
        await tx.companyProfile.create({
          data: {
            userId: newUser.id,
            companyName: data.companyName || `${data.firstName} ${data.lastName}`,
            companyType: (data.companyType as any) || 'OTHER',
            isShelter: data.userType === 'SHELTER',
          },
        });
        // Also create a user profile for the contact person
        await tx.userProfile.create({
          data: {
            userId: newUser.id,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        });
      } else {
        // Create user profile for individuals
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
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await prisma.refreshToken.create({
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

  async login(data: LoginDto) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        userProfile: true,
        companyProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw new Error('Account is not active');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
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
        companyProfile: user.companyProfile,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    // Find refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    // Check if expired
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new Error('Refresh token expired');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
}
