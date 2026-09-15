// Import any needed model functions
import { getAllCategories } from '../models/categories.js';

// Define any controller functions

// Controller to handle displaying all service project categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

// Export any controller functions
export { showCategoriesPage };
