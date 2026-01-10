"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
/**
 * @route   GET /api/users/profile
 * @desc    Get my profile
 * @access  Private
 */
router.get('/profile', auth_middleware_1.authenticate, userController.getMyProfile.bind(userController));
/**
 * @route   PUT /api/users/profile
 * @desc    Update my profile
 * @access  Private
 */
router.put('/profile', auth_middleware_1.authenticate, userController.updateMyProfile.bind(userController));
/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 */
router.get('/search', auth_middleware_1.authenticate, userController.searchUsers.bind(userController));
/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:userId', auth_middleware_1.authenticate, userController.getUserById.bind(userController));
exports.default = router;
//# sourceMappingURL=user.routes.js.map