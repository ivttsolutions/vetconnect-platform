-- VetConnect Database Initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Full-text search configuration for multiple languages
CREATE TEXT SEARCH CONFIGURATION public.spanish (COPY = pg_catalog.spanish);
CREATE TEXT SEARCH CONFIGURATION public.english (COPY = pg_catalog.english);
CREATE TEXT SEARCH CONFIGURATION public.german (COPY = pg_catalog.german);
CREATE TEXT SEARCH CONFIGURATION public.french (COPY = pg_catalog.french);

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vetconnect TO vetconnect;
