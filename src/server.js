require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../dist/client')));
app.use('/assets', express.static(path.join(__dirname, '../dist/client/assets')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/icons', express.static(path.join(__dirname, '../public/icons')));

// Rutas de la API
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

app.get('/api/menu-items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los items del menú' });
  }
});

app.post('/api/menu-items', upload.single('image'), async (req, res) => {
  try {
    const { name, price, ingredients, category_id, in_stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      'INSERT INTO menu_items (name, price, ingredients, category_id, in_stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, ingredients, category_id, in_stock === 'true', image_url]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el item del menú' });
  }
});

app.put('/api/menu-items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, ingredients, category_id, in_stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    let query = 'UPDATE menu_items SET name = $1, price = $2, ingredients = $3, category_id = $4, in_stock = $5';
    let values = [name, price, ingredients, category_id, in_stock === 'true'];
    
    if (image_url) {
      query += ', image_url = $6';
      values.push(image_url);
    }
    
    query += ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
    values.push(id);
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el item del menú' });
  }
});

app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    res.json({ message: 'Item eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el item del menú' });
  }
});

// Ruta para el panel de administración
app.use('/admin-panel', express.static(path.join(__dirname, '../public/admin-panel')));

// Todas las demás rutas sirven la aplicación principal
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;

// Para Vercel, exportamos la app
module.exports = app;

// Solo iniciamos el servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
} 