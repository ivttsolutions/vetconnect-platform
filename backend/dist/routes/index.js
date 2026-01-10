"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'VetConnect API is running',
        timestamp: new Date().toISOString(),
    });
});
// Routes
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/profile', profile_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map