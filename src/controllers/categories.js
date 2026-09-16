// Import category model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

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
export { showCategoriesPage, showCategoryDetailPage };
