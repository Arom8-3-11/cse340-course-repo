import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllOrganizations}  

// This code does the following:

// Imports the database connection from the db.js file.
// Defines an asynchronous function getAllOrganizations that queries the database for all organizations.
// Returns the rows of the result if successful.
// Exports the getAllOrganizations function so it can be used in other parts of the application.