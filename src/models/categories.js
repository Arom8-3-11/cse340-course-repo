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
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};

// Function to insert a new category and return the ID of the created record
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

// Function to update the name of an existing category by its ID
const updateCategory = async (id, name) => {
    const query = `
        UPDATE category
        SET name = $2
        WHERE category_id = $1;
    `;

    await db.query(query, [id, name]);
};

// Inserts a single category/project link into the many-to-many junction table
// Not exported; only used internally by updateCategoryAssignments
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

// Replaces all category assignments for a project with the given list of category IDs
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove existing category links for this project first
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Re-create a link for each selected category
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};