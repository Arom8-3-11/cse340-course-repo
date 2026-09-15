// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Define any controller functions

// Controller to handle displaying all service projects
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

// Export any controller functions
export { showProjectsPage };
