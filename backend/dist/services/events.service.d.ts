export declare class EventsService {
    createEvent(organizerId: string, data: {
        type: string;
        mode: string;
        title: string;
        description: string;
        coverImage?: string;
        startDate: Date;
        endDate: Date;
        timezone?: string;
        location?: string;
        address?: string;
        city?: string;
        country?: string;
        onlineUrl?: string;
        isFree?: boolean;
        price?: number;
        currency?: string;
        maxAttendees?: number;
        registrationDeadline?: Date;
        requiresApproval?: boolean;
    }): Promise<any>;
    getEvents(options?: {
        limit?: number;
        offset?: number;
        type?: string;
        mode?: string;
        city?: string;
        upcoming?: boolean;
    }): Promise<any>;
    getEvent(eventId: string, userId?: string): Promise<any>;
    registerToEvent(eventId: string, userId: string): Promise<any>;
    cancelRegistration(eventId: string, userId: string): Promise<{
        cancelled: boolean;
    }>;
    getMyRegistrations(userId: string): Promise<any>;
    getMyOrganizedEvents(organizerId: string): Promise<any>;
    getEventAttendees(eventId: string, organizerId: string): Promise<any>;
    updateRegistrationStatus(registrationId: string, organizerId: string, status: string): Promise<any>;
    cancelEvent(eventId: string, organizerId: string): Promise<any>;
}
//# sourceMappingURL=events.service.d.ts.map