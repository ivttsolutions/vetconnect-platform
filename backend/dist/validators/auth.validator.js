"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const validUserTypes = [
    'VET_PROFESSIONAL',
    'VET_TECHNICIAN',
    'STUDENT',
    'PET_OWNER',
    'COMPANY',
    'SHELTER',
    'GENERAL'
];
const validCompanyTypes = [
    'CLINIC',
    'HOSPITAL',
    'LABORATORY',
    'PHARMACEUTICAL',
    'SUPPLIER',
    'VET_COLLEGE',
    'UNIVERSITY',
    'RESEARCH_CENTER',
    'PET_STORE',
    'GROOMING',
    'INSURANCE',
    'NUTRITION',
    'RESCUE_ORGANIZATION',
    'NGO',
    'OTHER'
];
exports.registerValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('userType')
        .isIn(validUserTypes)
        .withMessage(`User type must be one of: ${validUserTypes.join(', ')}`),
    (0, express_validator_1.body)('companyName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('companyType')
        .optional()
        .isIn(validCompanyTypes)
        .withMessage(`Company type must be one of: ${validCompanyTypes.join(', ')}`),
];
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
exports.refreshTokenValidator = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required'),
];
//# sourceMappingURL=auth.validator.js.map