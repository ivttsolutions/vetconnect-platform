import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const controller = new ProfileController();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Profile routes
router.get('/me', authenticate, (req, res) => controller.getMyProfile(req, res));
router.get('/search', optionalAuth, (req, res) => controller.searchProfiles(req, res));
router.get('/:userId', optionalAuth, (req, res) => controller.getPublicProfile(req, res));
router.put('/me', authenticate, (req, res) => controller.updateProfile(req, res));

// Upload routes
router.post('/me/avatar', authenticate, upload.single('avatar'), (req, res) => controller.uploadAvatar(req, res));
router.post('/me/cover', authenticate, upload.single('cover'), (req, res) => controller.uploadCover(req, res));

// Experience routes
router.post('/me/experience', authenticate, (req, res) => controller.addExperience(req, res));
router.put('/me/experience/:experienceId', authenticate, (req, res) => controller.updateExperience(req, res));
router.delete('/me/experience/:experienceId', authenticate, (req, res) => controller.deleteExperience(req, res));

// Education routes
router.post('/me/education', authenticate, (req, res) => controller.addEducation(req, res));
router.put('/me/education/:educationId', authenticate, (req, res) => controller.updateEducation(req, res));
router.delete('/me/education/:educationId', authenticate, (req, res) => controller.deleteEducation(req, res));

// Skills routes
router.post('/me/skills', authenticate, (req, res) => controller.addSkill(req, res));
router.delete('/me/skills/:skillId', authenticate, (req, res) => controller.deleteSkill(req, res));

export default router;
