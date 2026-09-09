import db from './db.js'

const getAllProjects = async() => {
    // Include the sponsoring organization name with each service project.
    const query = `
        SELECT p.project_id, p.title, p.description, p.project_date, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date, p.title;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}