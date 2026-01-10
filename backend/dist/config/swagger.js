"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'VetConnect API',
            version: '1.0.0',
            description: 'Professional social network for the veterinary sector',
            contact: {
                name: 'VetConnect Support',
                email: 'support@vetconnect.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
                description: 'Development server',
            },
            {
                url: 'https://api.vetconnect.com/api/v1',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        userType: {
                            type: 'string',
                            enum: ['USER', 'COMPANY', 'SHELTER'],
                        },
                        role: {
                            type: 'string',
                            enum: ['USER', 'ADMIN', 'MODERATOR'],
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'PENDING_VERIFICATION'],
                        },
                        emailVerified: {
                            type: 'boolean',
                        },
                        twoFactorEnabled: {
                            type: 'boolean',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                UserProfile: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        firstName: {
                            type: 'string',
                        },
                        lastName: {
                            type: 'string',
                        },
                        avatar: {
                            type: 'string',
                            format: 'uri',
                        },
                        headline: {
                            type: 'string',
                        },
                        bio: {
                            type: 'string',
                        },
                        licenseNumber: {
                            type: 'string',
                        },
                        specialization: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        type: {
                            type: 'string',
                            enum: ['STANDARD', 'ARTICLE', 'CLINICAL_CASE', 'POLL', 'EVENT', 'ACHIEVEMENT'],
                        },
                        content: {
                            type: 'string',
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                        },
                        likesCount: {
                            type: 'integer',
                        },
                        commentsCount: {
                            type: 'integer',
                        },
                        sharesCount: {
                            type: 'integer',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                JobPost: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        jobType: {
                            type: 'string',
                            enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'VOLUNTEER'],
                        },
                        location: {
                            type: 'string',
                        },
                        salaryMin: {
                            type: 'integer',
                        },
                        salaryMax: {
                            type: 'integer',
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'CLOSED', 'DRAFT'],
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication required',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                success: false,
                                message: 'Unauthorized',
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description: 'Insufficient permissions',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                success: false,
                                message: 'Forbidden',
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                success: false,
                                message: 'Resource not found',
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Validation failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false,
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Validation failed',
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                field: {
                                                    type: 'string',
                                                },
                                                message: {
                                                    type: 'string',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'Authentication and authorization endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Profiles',
                description: 'User and company profile endpoints',
            },
            {
                name: 'Posts',
                description: 'Feed and post management endpoints',
            },
            {
                name: 'Connections',
                description: 'Networking and connections endpoints',
            },
            {
                name: 'Jobs',
                description: 'Job board endpoints',
            },
            {
                name: 'Products',
                description: 'Product catalog endpoints',
            },
            {
                name: 'Events',
                description: 'Event management endpoints',
            },
            {
                name: 'Messages',
                description: 'Messaging endpoints',
            },
            {
                name: 'Notifications',
                description: 'Notification endpoints',
            },
            {
                name: 'Shelters',
                description: 'Animal shelter endpoints',
            },
            {
                name: 'Admin',
                description: 'Admin panel endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map