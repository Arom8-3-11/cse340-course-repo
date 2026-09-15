// Import any needed model functions
import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define any controller functions

// Controller to handle displaying the list of all partner organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Controller to handle displaying a specific organization's detail page and its projects
const showOrganizationDetailPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organization = await getOrganizationById(organizationId);

        // If no organization found with this ID, pass a 404 error to error middleware
        if (!organization) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);
        const title = organization.name;

        res.render('organization', { title, organization, projects });
    } catch (error) {
        next(error);
    }
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailPage };
