CREATE DATABASE IF NOT EXISTS school_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX idx_coordinates ON schools(latitude, longitude);
CREATE INDEX idx_name ON schools(name);
