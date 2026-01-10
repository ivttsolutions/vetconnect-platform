"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', auth_validator_1.registerValidator, validate_middleware_1.validate, authController.register.bind(authController));
/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', auth_validator_1.loginValidator, validate_middleware_1.validate, authController.login.bind(authController));
/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', auth_validator_1.refreshTokenValidator, validate_middleware_1.validate, authController.refreshToken.bind(authController));
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth_middleware_1.authenticate, authController.logout.bind(authController));
/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', auth_middleware_1.authenticate, authController.getMe.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map