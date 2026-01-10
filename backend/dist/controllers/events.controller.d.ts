import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class EventsController {
    getEvents(req: AuthRequest, res: Response): Promise<void>;
    getEvent(req: AuthRequest, res: Response): Promise<void>;
    createEvent(req: AuthRequest, res: Response): Promise<void>;
    registerToEvent(req: AuthRequest, res: Response): Promise<void>;
    cancelRegistration(req: AuthRequest, res: Response): Promise<void>;
    getMyRegistrations(req: AuthRequest, res: Response): Promise<void>;
    getMyOrganizedEvents(req: AuthRequest, res: Response): Promise<void>;
    getEventAttendees(req: AuthRequest, res: Response): Promise<void>;
    updateRegistrationStatus(req: AuthRequest, res: Response): Promise<void>;
    cancelEvent(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=events.controller.d.ts.map