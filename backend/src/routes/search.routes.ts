import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const searchController = new SearchController();

// Búsqueda global
router.get('/', optionalAuth, (req, res) => searchController.searchAll(req, res));

// Búsqueda de usuarios
router.get('/users', optionalAuth, (req, res) => searchController.searchUsers(req, res));

export default router;
