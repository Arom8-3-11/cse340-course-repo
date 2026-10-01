import express from 'express';

// Import controller functions
import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    processDeleteOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm,
    processEditProjectForm,
    processDeleteProjectForm,
    projectValidation 
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    processDeleteCategoryForm,
    categoryValidation
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    registrationValidation,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from './controllers/users.js';

// Create Express router instance
const router = express.Router();


// Main Application Routes


// Home page route
router.get('/', showHomePage);

// User registration and authentication routes
router.get('/register', showUserRegistrationForm);
router.post('/register', registrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin', '/dashboard'), showUsersPage);

// Partner organizations routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailPage);

// Protect write and management pages on the server; hiding their links is not authorization.
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.post('/delete-organization/:id', requireRole('admin'), processDeleteOrganizationForm);

// Service projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Route to display the edit project form
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
// Route to handle the edit project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.post('/delete-project/:id', requireRole('admin'), processDeleteProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Categories routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailPage);

// Route for new category page
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
// Route to handle new category form submission
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
// Route to handle the edit category form submission
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.post('/delete-category/:id', requireRole('admin'), processDeleteCategoryForm);


// Error Handling Test Routes
router.get('/test-error', testErrorPage);

export default router;

