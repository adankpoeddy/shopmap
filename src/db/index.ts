import Database from 'better-sqlite3';
import { Store, Product } from '../types';

const db = new Database('stores.db');

// Initialiser la base de données
db.exec(`
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    store_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
  );
`);

export const getStores = (): Store[] => {
  const stmt = db.prepare(`
    SELECT 
      s.*,
      json_group_array(
        json_object(
          'id', p.id,
          'name', p.name,
          'quantity', p.quantity,
          'storeId', p.store_id
        )
      ) as products
    FROM stores s
    LEFT JOIN products p ON s.id = p.store_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `);
  
  return stmt.all().map(row => ({
    ...row,
    products: JSON.parse(row.products).filter((p: any) => p.id !== null)
  }));
};

export const addStore = (store: Omit<Store, 'id'>): Store => {
  const stmt = db.prepare(
    'INSERT INTO stores (name, latitude, longitude) VALUES (?, ?, ?) RETURNING *'
  );
  return stmt.get(store.name, store.latitude, store.longitude) as Store;
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const stmt = db.prepare(
    'INSERT INTO products (name, quantity, store_id) VALUES (?, ?, ?) RETURNING *'
  );
  return stmt.get(product.name, product.quantity, product.storeId) as Product;
};

export const updateProductQuantity = (productId: number, quantity: number): void => {
  const stmt = db.prepare('UPDATE products SET quantity = ? WHERE id = ?');
  stmt.run(quantity, productId);
};

export default db;