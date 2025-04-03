-- Crear la tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Crear la tabla de items del menú
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    ingredients TEXT,
    category_id INTEGER REFERENCES categories(id),
    in_stock BOOLEAN DEFAULT true,
    image_url TEXT
);

-- Insertar categorías
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