-- DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password_hash VARCHAR(255),
    secret_b64 VARCHAR(255)
);

INSERT INTO users
	(email, first_name, last_name, password_hash, secret_b64)
VALUES
	('admin@localhost', 'Admin', '(Built-in)', '$argon2i$v=19$m=4096,t=3,p=1$wqLCu8OEwoxhA0xRwqA6wr9ow4svFcKC$ZF3sZSicgp39oyjPtQzthYpJovV2JlRHa8GDLezROmE', 'mrMlyfW6TUKSMqifDaDS0Q==');