import db from './db.js';

// Function to retrieve all categories from the database
const getAllCategories = async () => {
    // Categories are listed on their own; project links are stored separately in junction table.
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Function to retrieve a single category by its unique ID
// Uses a parameterized query ($1) to safely prevent SQL injection attacks
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0];
};

// Function to retrieve all categories associated with a given service project
// Joins the category table with the project_category junction table
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

// Function to retrieve all service projects for a given category
// Joins project, project_category junction table, and organization to get full project info
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC, p.title ASC;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId 
};