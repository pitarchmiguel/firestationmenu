require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/icons', express.static(path.join(__dirname, '../public/icons')));

// Rutas de la API
app.get('/api', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas para categorías
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Rutas para items del menú
app.get('/api/menu-items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener items del menú' });
  }
});

app.post('/api/menu-items', upload.single('image'), async (req, res) => {
  try {
    const { name, price, ingredients, in_stock, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      'INSERT INTO menu_items (name, price, ingredients, in_stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, ingredients, in_stock, category_id, image_url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear item del menú:', err);
    res.status(500).json({ error: 'Error al crear item del menú' });
  }
});

app.put('/api/menu-items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, ingredients, in_stock, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      'UPDATE menu_items SET name = $1, price = $2, ingredients = $3, in_stock = $4, category_id = $5, image_url = COALESCE($6, image_url) WHERE id = $7 RETURNING *',
      [name, price, ingredients, in_stock, category_id, image_url, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar item del menú:', err);
    res.status(500).json({ error: 'Error al actualizar item del menú' });
  }
});

app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM menu_items WHERE id = $1', [id]);
    res.json({ message: 'Item eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar item del menú:', err);
    res.status(500).json({ error: 'Error al eliminar item del menú' });
  }
});

// Ruta para servir el frontend - debe ir después de las rutas de la API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 