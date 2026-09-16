import express from 'express';

// Import controller functions
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

// Create Express router instance
const router = express.Router();

// =======================
// Main Application Routes
// =======================

// Home page route
router.get('/', showHomePage);

// Partner organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailPage);

// Service projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Categories routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailPage);

// =======================
// Error Handling Test Routes
// =======================
router.get('/test-error', testErrorPage);

export default router;
