"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const controller = new profile_controller_1.ProfileController();
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
// Profile routes
router.get('/me', auth_middleware_1.authenticate, (req, res) => controller.getMyProfile(req, res));
router.get('/search', auth_middleware_1.optionalAuth, (req, res) => controller.searchProfiles(req, res));
router.get('/:userId', auth_middleware_1.optionalAuth, (req, res) => controller.getPublicProfile(req, res));
router.put('/me', auth_middleware_1.authenticate, (req, res) => controller.updateProfile(req, res));
// Upload routes
router.post('/me/avatar', auth_middleware_1.authenticate, upload.single('avatar'), (req, res) => controller.uploadAvatar(req, res));
router.post('/me/cover', auth_middleware_1.authenticate, upload.single('cover'), (req, res) => controller.uploadCover(req, res));
// Experience routes
router.post('/me/experience', auth_middleware_1.authenticate, (req, res) => controller.addExperience(req, res));
router.put('/me/experience/:experienceId', auth_middleware_1.authenticate, (req, res) => controller.updateExperience(req, res));
router.delete('/me/experience/:experienceId', auth_middleware_1.authenticate, (req, res) => controller.deleteExperience(req, res));
// Education routes
router.post('/me/education', auth_middleware_1.authenticate, (req, res) => controller.addEducation(req, res));
router.put('/me/education/:educationId', auth_middleware_1.authenticate, (req, res) => controller.updateEducation(req, res));
router.delete('/me/education/:educationId', auth_middleware_1.authenticate, (req, res) => controller.deleteEducation(req, res));
// Skills routes
router.post('/me/skills', auth_middleware_1.authenticate, (req, res) => controller.addSkill(req, res));
router.delete('/me/skills/:skillId', auth_middleware_1.authenticate, (req, res) => controller.deleteSkill(req, res));
exports.default = router;
//# sourceMappingURL=profile.routes.js.map