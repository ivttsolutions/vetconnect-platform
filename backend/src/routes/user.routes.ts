import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/users/profile
 * @desc    Get my profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  userController.getMyProfile.bind(userController)
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update my profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  userController.updateMyProfile.bind(userController)
);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 */
router.get(
  '/search',
  authenticate,
  userController.searchUsers.bind(userController)
);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:userId',
  authenticate,
  userController.getUserById.bind(userController)
);

export default router;
