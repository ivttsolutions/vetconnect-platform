"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const connections_routes_1 = __importDefault(require("./connections.routes"));
const notifications_routes_1 = __importDefault(require("./notifications.routes"));
const messages_routes_1 = __importDefault(require("./messages.routes"));
const jobs_routes_1 = __importDefault(require("./jobs.routes"));
const events_routes_1 = __importDefault(require("./events.routes"));
const search_routes_1 = __importDefault(require("./search.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
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
router.use('/posts', posts_routes_1.default);
router.use('/connections', connections_routes_1.default);
router.use('/notifications', notifications_routes_1.default);
router.use('/messages', messages_routes_1.default);
router.use('/jobs', jobs_routes_1.default);
router.use('/events', events_routes_1.default);
router.use('/search', search_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/admin', admin_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map