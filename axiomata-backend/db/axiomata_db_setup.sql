-- =====================================================
-- Axiomata Database Initialization Script
-- =====================================================

-- 1️ Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS axiomata_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2️ Drop the user if it already exists
DROP USER IF EXISTS 'axiomata_user'@'localhost';

-- 3️ Create a new user with a secure password
CREATE USER 'axiomata_user'@'localhost' IDENTIFIED BY 'YourNewStrongPassword';

-- 4️ Grant privileges on the database
GRANT ALL PRIVILEGES ON axiomata_db.* TO 'axiomata_user'@'localhost';

-- Optional: make sure changes are applied
FLUSH PRIVILEGES;

-- =====================================================
-- You can add table creation, seed data, or other setup below
-- =====================================================
