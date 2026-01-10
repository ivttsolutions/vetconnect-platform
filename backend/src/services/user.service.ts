import prisma from '../config/prisma';
import { UpdateProfileDto } from '../types';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
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

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userProfile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.userProfile) {
      throw new Error('User profile not found');
    }

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data,
    });

    return updatedProfile;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
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

  async searchUsers(query: string, limit: number = 10) {
    const users = await prisma.user.findMany({
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
