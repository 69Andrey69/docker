-- Дополнительная инициализация базы данных
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Простая вставка без ON CONFLICT
INSERT INTO products (name, price) 
SELECT 'Laptop', 999.99
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop');

INSERT INTO products (name, price) 
SELECT 'Mouse', 29.99
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mouse');

INSERT INTO products (name, price) 
SELECT 'Keyboard', 79.99
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Keyboard');