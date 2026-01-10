import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class ConnectionController {
    sendRequest(req: AuthRequest, res: Response): Promise<void>;
    acceptRequest(req: AuthRequest, res: Response): Promise<void>;
    rejectRequest(req: AuthRequest, res: Response): Promise<void>;
    cancelRequest(req: AuthRequest, res: Response): Promise<void>;
    removeConnection(req: AuthRequest, res: Response): Promise<void>;
    getPendingRequests(req: AuthRequest, res: Response): Promise<void>;
    getSentRequests(req: AuthRequest, res: Response): Promise<void>;
    getConnections(req: AuthRequest, res: Response): Promise<void>;
    getConnectionsCount(req: AuthRequest, res: Response): Promise<void>;
    getConnectionStatus(req: AuthRequest, res: Response): Promise<void>;
    searchUsers(req: AuthRequest, res: Response): Promise<void>;
    getSuggestions(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=connections.controller.d.ts.map