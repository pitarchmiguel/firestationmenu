require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const menuData = JSON.parse(fs.readFileSync('./src/components/menu.json', 'utf8'));

async function importData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Importar items del menú
    for (const category of menuData.menu) {
      for (const item of category.items) {
        await client.query(
          `INSERT INTO menu_items (name, price, ingredients, in_stock, category_id, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            item.name,
            item.price,
            item.ingredients || null,
            item.inStock,
            category.id,
            item.image || null
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Datos importados correctamente');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al importar datos:', err);
  } finally {
    client.release();
    pool.end();
  }
}

importData(); 