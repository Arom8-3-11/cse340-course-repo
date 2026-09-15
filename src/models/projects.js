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

export { getAllProjects, getProjectsByOrganizationId };