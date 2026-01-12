"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Grace Champions API',
            version: '1.0.0',
            description: 'Fast data-entry system for collecting contact information',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        tags: [
            {
                name: 'Contacts',
                description: 'Contact management endpoints',
            },
            {
                name: 'Health',
                description: 'System health check',
            },
        ],
        components: {
            schemas: {
                Contact: {
                    type: 'object',
                    required: ['name', 'phone'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated MongoDB ID',
                            example: '65a1b2c3d4e5f6g7h8i9j0k1',
                        },
                        name: {
                            type: 'string',
                            description: "Contact's full name",
                            example: 'John Doe',
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number (cleaned, no spaces/dashes)',
                            example: '08012345678',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp when record was created',
                            example: '2026-01-11T10:30:00.000Z',
                        },
                    },
                },
                ContactInput: {
                    type: 'object',
                    required: ['name', 'phone'],
                    properties: {
                        name: {
                            type: 'string',
                            description: "Contact's full name",
                            example: 'John Doe',
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number',
                            example: '08012345678',
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Contact saved successfully',
                        },
                        data: {
                            $ref: '#/components/schemas/Contact',
                        },
                    },
                },
                ErrorResponse: {
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
                DuplicateResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'This phone number already exists',
                        },
                        duplicate: {
                            type: 'boolean',
                            example: true,
                        },
                    },
                },
                CountResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        count: {
                            type: 'number',
                            example: 42,
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/server.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
