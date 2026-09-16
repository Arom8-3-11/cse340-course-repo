// Import project model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
// Import category model functions to retrieve categories for a specific project
import { getCategoriesByProjectId } from '../models/categories.js';

// Number of upcoming projects to display on the main service projects page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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
export { showProjectsPage, showProjectDetailsPage };
