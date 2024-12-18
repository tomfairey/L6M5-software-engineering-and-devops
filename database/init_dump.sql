DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS scanlog CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password_hash VARCHAR(255),
    secret_b64 VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS scanlog (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scan_value TEXT NOT NULL,
    valid BOOLEAN NOT NULL,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT,
    format VARCHAR(16),
    user_uuid UUID REFERENCES users(uuid) ON DELETE SET NULL
);

-- CREATE TABLE IF NOT EXISTS companies (
--     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     name TEXT NOT NULL,
--     code VARCHAR(16) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS products (
--     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     name TEXT NOT NULL,
--     company INT NOT NULL REFERENCES companies(id),
--     code VARCHAR(16) NOT NULL
-- );

INSERT INTO users
	(email, first_name, last_name, password_hash, secret_b64, is_admin)
VALUES
	('admin@localhost.local', 'Admin', '(Built-in)', '$argon2id$v=19$m=65536,t=3,p=4$lOfjnfN6J/VBYOy+DbxxhA$sV23O48bpa+DPRRkYwIJHDwfHf7CjfZ6Go7D1pDMGfI', 'hGyU5mA/8tinAmksNhxGXHz5UorE2A+tE4vG8H6te+4=', TRUE);

SELECT * FROM users;
SELECT * FROM scanlog;
SELECT * FROM companies;
SELECT * FROM products;