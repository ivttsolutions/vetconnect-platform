"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("../services/search.service");
const response_util_1 = require("../utils/response.util");
const searchService = new search_service_1.SearchService();
class SearchController {
    async searchAll(req, res) {
        try {
            const { q, limit } = req.query;
            if (!q || typeof q !== 'string' || q.trim().length < 2) {
                (0, response_util_1.sendError)(res, 'La búsqueda debe tener al menos 2 caracteres', 400);
                return;
            }
            const results = await searchService.searchAll(q.trim(), {
                limit: limit ? parseInt(limit) : 10,
            });
            (0, response_util_1.sendSuccess)(res, results, 'Búsqueda completada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async searchUsers(req, res) {
        try {
            const { q, limit, offset, userType } = req.query;
            if (!q || typeof q !== 'string' || q.trim().length < 2) {
                (0, response_util_1.sendError)(res, 'La búsqueda debe tener al menos 2 caracteres', 400);
                return;
            }
            const users = await searchService.searchUsers(q.trim(), {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
                userType: userType,
            });
            (0, response_util_1.sendSuccess)(res, users, 'Usuarios encontrados');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map