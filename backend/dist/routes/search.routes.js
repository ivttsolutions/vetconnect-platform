"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const searchController = new search_controller_1.SearchController();
// Búsqueda global
router.get('/', auth_middleware_1.optionalAuth, (req, res) => searchController.searchAll(req, res));
// Búsqueda de usuarios
router.get('/users', auth_middleware_1.optionalAuth, (req, res) => searchController.searchUsers(req, res));
exports.default = router;
//# sourceMappingURL=search.routes.js.map