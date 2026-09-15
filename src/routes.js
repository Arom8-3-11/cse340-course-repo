import express from 'express';

// Import controller functions
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
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

// Service projects route
router.get('/projects', showProjectsPage);

// Categories route
router.get('/categories', showCategoriesPage);

// =======================
// Error Handling Test Routes
// =======================
router.get('/test-error', testErrorPage);

export default router;
