-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    UNIQUE (organization_id, title, project_date),
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Community Garden Shed Build', 'Build storage sheds for a neighborhood garden program.', 'Downtown Community Garden', '2026-04-11'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Senior Center Ramp Repair', 'Repair and repaint accessibility ramps at the senior center.', 'Northside Senior Center', '2026-04-18'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Playground Safety Refresh', 'Replace worn playground boards and refresh safety surfacing.', 'Riverside Park', '2026-05-02'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Habitat Porch Project', 'Construct a safe front porch for a local family.', 'Maple Street Neighborhood', '2026-05-16'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Shelter Weatherproofing Day', 'Seal windows and improve weatherproofing at a community shelter.', 'Hope Community Shelter', '2026-06-06'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Urban Farm Planting Day', 'Plant spring vegetables in shared urban garden beds.', 'GreenHarvest Urban Farm', '2026-04-04'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Compost Education Workshop', 'Teach residents how to start and maintain compost systems.', 'Community Learning Center', '2026-04-25'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Fresh Food Distribution', 'Sort and distribute locally grown produce to families.', 'Eastside Food Pantry', '2026-05-09'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'School Garden Setup', 'Prepare raised beds and irrigation for an elementary school garden.', 'Lincoln Elementary School', '2026-05-23'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Pollinator Pathway Planting', 'Plant native flowers to support pollinators around community gardens.', 'Meadowbrook Trail', '2026-06-13'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Weekend Food Pantry Shift', 'Organize donated food and help families pick up pantry boxes.', 'Central Food Pantry', '2026-04-12'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Community Tutoring Night', 'Provide homework help and reading support for local students.', 'Westside Library', '2026-04-28'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Neighborhood Cleanup Crew', 'Remove litter and clean shared public spaces.', 'Oak Avenue District', '2026-05-10'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Health Fair Volunteer Team', 'Help visitors check in and find resources at a community health fair.', 'Civic Center Hall', '2026-05-30'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Donation Sorting Drive', 'Sort clothing and household donations for partner charities.', 'UnityServe Donation Center', '2026-06-20');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Category Junction Table
-- ========================================
-- Allows each project to have multiple categories and each category to include multiple projects.
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Environmental'),
('Education'),
('Community Support'),
('Health and Wellness');

-- ========================================
-- Associate existing projects with categories
-- ========================================
INSERT INTO project_category (project_id, category_id)
SELECT project_id, category_id
FROM (
    SELECT project_id, ROW_NUMBER() OVER (ORDER BY project_id) AS project_number
    FROM project
) project_list
JOIN (
    SELECT category_id,
        ROW_NUMBER() OVER (ORDER BY category_id) AS category_number,
        COUNT(*) OVER () AS category_count
    FROM category
) category_list
ON ((project_list.project_number - 1) % category_list.category_count) + 1 = category_list.category_number;

