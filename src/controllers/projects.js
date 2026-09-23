// Import project model functions
import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
// Import category model functions to retrieve categories for a specific project
import { getCategoriesByProjectId } from '../models/categories.js';
// Import organization model function to populate the organization dropdown on the new project form
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Number of upcoming projects to display on the main service projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Validation + sanitization rules for the new service project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required.')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required.')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required.')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters.'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required.')
        .isDate()
        .withMessage('Project date must be a valid date.'),
    body('organizationId')
        .notEmpty()
        .withMessage('An organization must be selected.')
        .isInt()
        .withMessage('Organization selection is invalid.')
];

// Define controller functions

// Controller to handle displaying the upcoming service projects page
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

// Controller to handle displaying a single service project's details page
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await getProjectDetails(id);

        // If no matching project found, create a 404 error
        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        // Retrieve category tags associated with this project
        const categories = await getCategoriesByProjectId(id);
        const title = project.title;

        res.render('project', { title, project, categories });
    } catch (error) {
        next(error);
    }
};

// Export controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation 
};

// Controller to render the new service project form, including the organization dropdown
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

// Controller to process the new service project form submission (POST)
const processNewProjectForm = async (req, res) => {
    // Check the validation rules applied to this route before touching the database
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
};
