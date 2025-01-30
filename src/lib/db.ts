// src/lib/db.ts - MySQL Database Schema
/*
CREATE TABLE kaizen_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme VARCHAR(100) NOT NULL,
  idea VARCHAR(100) NOT NULL,
  period VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  drive_file_id VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_theme ON kaizen_reports(theme);
CREATE INDEX idx_idea ON kaizen_reports(idea);
CREATE INDEX idx_period ON kaizen_reports(period);
*/

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;