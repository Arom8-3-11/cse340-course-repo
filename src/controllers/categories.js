// Import category model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
// Import project model function to display project details on the assign categories form
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation + sanitization rules shared by the new and edit category forms
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

// Define controller functions

// Controller to handle displaying all service project categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

// Controller to handle displaying a specific category and all its associated service projects
const showCategoryDetailPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        // If the requested category does not exist, trigger a 404 error
        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        // Retrieve all service projects linked to this category
        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (error) {
        next(error);
    }
};

// Export controller functions
export { 
    showCategoriesPage, 
    showCategoryDetailPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};

// Controller to render the blank form for creating a new category
const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

// Controller to process the new category form submission (POST)
const processNewCategoryForm = async (req, res) => {
    // Check the validation rules applied to this route before touching the database
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Store each validation error as a flash message, then send the user back to the form
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    const categoryId = await createCategory(name);
    req.flash('success', 'Category added successfully!');
    res.redirect(`/category/${categoryId}`);
};

// Controller to render the edit form, pre-populated with the category's current data
const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);

    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
};

// Controller to process the edit category form submission (POST)
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    // Reuses the same validation rules as the new category form
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

// Controller to render the checkbox form used to assign categories to a project
const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getAllCategories();
    // Categories already linked to this project, used to pre-check their checkboxes
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

// Controller to process the assign categories form submission (POST)
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // A single checked checkbox submits a string instead of an array, so normalize it here
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};
