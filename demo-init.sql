CREATE TABLE IF NOT EXISTS demo_data (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO demo_data (message) VALUES 
('Hello from Docker Volume Demo'),
('This data persists in named volume'),
('Portainer will help us inspect this');