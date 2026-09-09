import db from './db.js'

const getAllCategories = async() => {
    // Categories are listed on their own; project links are stored separately.
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllCategories}