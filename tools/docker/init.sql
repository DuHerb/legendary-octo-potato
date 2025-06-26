-- Initial database setup for envelope budgeting application
-- This file is executed when the PostgreSQL container starts for the first time

-- Create additional databases if needed
-- CREATE DATABASE envelope_budget_staging;

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE envelope_budget_dev TO envelope_budget_user;

-- Set default settings for better performance in development
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Create a read-only user for analytics/reporting (optional)
-- CREATE USER envelope_budget_readonly WITH PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE envelope_budget_dev TO envelope_budget_readonly;
-- GRANT USAGE ON SCHEMA public TO envelope_budget_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO envelope_budget_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO envelope_budget_readonly;