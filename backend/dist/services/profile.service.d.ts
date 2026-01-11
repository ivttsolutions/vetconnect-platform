export declare class ProfileService {
    getUserProfile(userId: string): Promise<any>;
    getPublicProfile(userId: string, viewerId?: string): Promise<any>;
    updateUserProfile(userId: string, data: any): Promise<any>;
    updateAvatar(userId: string, avatarUrl: string): Promise<any>;
    updateCover(userId: string, coverUrl: string): Promise<any>;
    addExperience(userId: string, data: any): Promise<any>;
    updateExperience(experienceId: string, userId: string, data: any): Promise<any>;
    deleteExperience(experienceId: string, userId: string): Promise<any>;
    addEducation(userId: string, data: any): Promise<any>;
    updateEducation(educationId: string, userId: string, data: any): Promise<any>;
    deleteEducation(educationId: string, userId: string): Promise<any>;
    addSkill(userId: string, name: string): Promise<any>;
    deleteSkill(skillId: string, userId: string): Promise<any>;
    searchProfiles(query: string, filters?: any): Promise<any>;
}
//# sourceMappingURL=profile.service.d.ts.map