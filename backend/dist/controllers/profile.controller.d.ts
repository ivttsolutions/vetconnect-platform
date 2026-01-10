import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class ProfileController {
    getMyProfile(req: AuthRequest, res: Response): Promise<void>;
    getPublicProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    uploadAvatar(req: AuthRequest, res: Response): Promise<void>;
    uploadCover(req: AuthRequest, res: Response): Promise<void>;
    addExperience(req: AuthRequest, res: Response): Promise<void>;
    updateExperience(req: AuthRequest, res: Response): Promise<void>;
    deleteExperience(req: AuthRequest, res: Response): Promise<void>;
    addEducation(req: AuthRequest, res: Response): Promise<void>;
    updateEducation(req: AuthRequest, res: Response): Promise<void>;
    deleteEducation(req: AuthRequest, res: Response): Promise<void>;
    addSkill(req: AuthRequest, res: Response): Promise<void>;
    deleteSkill(req: AuthRequest, res: Response): Promise<void>;
    searchProfiles(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=profile.controller.d.ts.map