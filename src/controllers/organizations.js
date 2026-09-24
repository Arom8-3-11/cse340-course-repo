// Import any needed model functions
import { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation + sanitization rules shared by the new and edit organization forms
const organizationValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required.')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters.'),
    body('contactEmail')
        .trim()
        .isEmail()
        .withMessage('A valid contact email is required.')
        .normalizeEmail()
];

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
export { 
    showOrganizationsPage, 
    showOrganizationDetailPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};

// Controller to render the blank form for creating a new organization
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

// Controller to process the new organization form submission (POST)
const processNewOrganizationForm = async (req, res) => {
    // Check the validation rules applied to this route before touching the database
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Store each validation error as a flash message, then send the user back to the form
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

// Controller to render the edit form, pre-populated with the organization's current data
const showEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationById(organizationId);

    if (!organizationDetails) {
        const err = new Error('Organization Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};

// Controller to process the edit organization form submission (POST)
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Reuses the same validation rules as the new organization form
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};
