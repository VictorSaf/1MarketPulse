-- ============================================================================
-- Database Initialization Script for 1MarketPulse
-- Run this script to initialize the complete database schema
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\echo '=== Running migration 001: Core Tables ==='
\i /docker-entrypoint-initdb.d/migrations/001_create_core_tables.sql

\echo '=== Running migration 002: Learning Tables ==='
\i /docker-entrypoint-initdb.d/migrations/002_create_learning_tables.sql

\echo '=== Running migration 003: Social Tables ==='
\i /docker-entrypoint-initdb.d/migrations/003_create_social_tables.sql

\echo '=== Running migration 004: Trading Tables ==='
\i /docker-entrypoint-initdb.d/migrations/004_create_trading_tables.sql

\echo '=== Running migration 005: Settings Tables ==='
\i /docker-entrypoint-initdb.d/migrations/005_create_settings_tables.sql

\echo '=== Running migration 006: Audit Tables ==='
\i /docker-entrypoint-initdb.d/migrations/006_create_audit_tables.sql

\echo '=== Running migration 007: Schema Fixes ==='
\i /docker-entrypoint-initdb.d/migrations/007_schema_fixes.sql

\echo '=== All migrations completed successfully! ==='
