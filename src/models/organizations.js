import db from './db.js';

// Function to retrieve all organizations from the database
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Function to retrieve details of a specific organization by its ID
// Uses a parameterized query ($1) to prevent SQL injection vulnerabilities
const getOrganizationById = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows[0];
};

export { getAllOrganizations, getOrganizationById };