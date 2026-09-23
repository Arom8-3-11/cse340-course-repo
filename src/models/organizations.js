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

// Function to insert a new organization and return the ID of the created record
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

// Function to update all editable fields of an existing organization by its ID
const updateOrganization = async (id, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE organization
        SET name = $2, description = $3, contact_email = $4, logo_filename = $5
        WHERE organization_id = $1;
    `;

    const queryParams = [id, name, description, contactEmail, logoFilename];
    await db.query(query, queryParams);
};

export { createOrganization, updateOrganization };