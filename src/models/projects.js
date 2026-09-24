import db from './db.js';

// Function to retrieve all service projects with their sponsoring organization names
const getAllProjects = async () => {
    // Include the sponsoring organization name with each service project.
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date, p.title;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Function to retrieve the next upcoming service projects (date >= today)
// Parameterized with $1 for LIMIT to accept any number of projects dynamically and securely
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.project_date,
            p.project_date AS date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
};

// Function to retrieve a single service project's complete details by its ID
// Uses JOIN to fetch the linked organization name and parameterized query ($1) for security
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.project_date,
            p.project_date AS date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

// Function to retrieve all service projects associated with a specific organization
// Uses a parameterized query ($1) for security against SQL injection
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, title, description, location, project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date, title;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

export { 
    getAllProjects, 
    getUpcomingProjects, 
    getProjectDetails, 
    getProjectsByOrganizationId,
    createProject,
    updateProject
};

// Function to insert a new service project tied to a sponsoring organization; returns the new ID
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// Function to update all editable fields of an existing service project by its ID
const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE project
        SET title = $2, description = $3, location = $4, project_date = $5, organization_id = $6
        WHERE project_id = $1
        RETURNING project_id;
    `;

    const queryParams = [id, title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }
};