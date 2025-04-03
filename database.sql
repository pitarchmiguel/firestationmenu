-- Crear la tabla de categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de items del menú
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    ingredients TEXT,
    in_stock BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales basados en el JSON actual
INSERT INTO categories (name) VALUES 
('Bocadillos'),
('Tostas'),
('Bowls'),
('Menu'),
('Batidos'),
('Zumos'),
('Refrescos/Agua'),
('Cervezas'),
('Cafes e Infusiones'),
('Tartas y dulces Saludables'),
('Tartas por Encargo'); 