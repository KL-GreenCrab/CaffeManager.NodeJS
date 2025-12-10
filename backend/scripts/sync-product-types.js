const mysql = require('mysql2/promise');

function inferTypeFromName(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('coffee') || n.includes('cà phê') || n.includes('cafe') || n.includes('capuchino') || n.includes('cappuccino')) return 'coffee';
  if (n.includes('tea') || n.includes('trà')) return 'tea';
  if (n.includes('smoothie') || n.includes('sinh tố') || n.includes('sinhto')) return 'smoothie';
  if (n.includes('soda') || n.includes('nước ngọt') || n.includes('nước ngọt')) return 'soda';
  if (n.includes('juice') || n.includes('nước ép') || n.includes('nuoc ep')) return 'juice';
  return null;
}

async function sync() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const database = process.env.DB_DATABASE || 'coffee_db';

  const conn = await mysql.createConnection({ host, user, password, port, database });
  console.log('Connected to DB', host, database);

  // Ensure `type` column exists; if not, add it as enum with default 'coffee'
  const [cols] = await conn.execute(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'type'`,
    [database]
  );
  if (!cols || (Array.isArray(cols) && cols.length === 0)) {
    console.log("Column 'type' not found on 'products' — adding column...");
    await conn.execute("ALTER TABLE `products` ADD COLUMN `type` ENUM('coffee','tea','smoothie','soda','juice') NOT NULL DEFAULT 'coffee'");
    console.log("Column 'type' added.");
  }

  // Select products where type is NULL or empty
  const [rows] = await conn.execute('SELECT id, name, `type` FROM products');
  const products = rows;

  let updated = 0;
  const updates = [];
  for (const p of products) {
    const current = p.type;
    if (current && current !== '') continue; // skip already set
    const inferred = inferTypeFromName(p.name || '');
    const newType = inferred || 'coffee'; // default fallback
    updates.push({ id: p.id, old: current, newType });
  }

  for (const u of updates) {
    await conn.execute('UPDATE products SET `type` = ? WHERE id = ?', [u.newType, u.id]);
    console.log(`Updated product id=${u.id} -> type='${u.newType}'`);
    updated++;
  }

  console.log(`Done. Products checked: ${products.length}, updated: ${updated}`);
  await conn.end();
}

sync().catch(err => { console.error('Error syncing product types:', err); process.exit(1); });
