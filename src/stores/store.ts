import { ref } from 'vue';
import type { Store, Product } from '../types';

const STORAGE_KEY = 'store-locations';
const PRODUCTS_KEY = 'store-products';

// Load initial data from localStorage
const loadStores = (): Store[] => {
  const stores = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  
  return stores.map((store: Store) => ({
    ...store,
    products: products.filter((p: Product) => p.storeId === store.id)
  }));
};

export const stores = ref<Store[]>(loadStores());

const saveData = () => {
  const products = stores.value.flatMap(store => store.products || []);
  const storesWithoutProducts = stores.value.map(({ products, ...store }) => store);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storesWithoutProducts));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

let currentId = Math.max(0, ...stores.value.map(s => s.id), ...stores.value.flatMap(s => s.products?.map(p => p.id) || []));

const getNextId = (): number => {
  currentId += 1;
  return currentId;
};

export const addStore = (storeData: Omit<Store, 'id' | 'products'>): Store => {
  const newStore: Store = {
    ...storeData,
    id: getNextId(),
    products: []
  };
  stores.value.push(newStore);
  saveData();
  return newStore;
};

export const addProduct = (productData: Omit<Product, 'id'>): Product => {
  const store = stores.value.find(s => s.id === productData.storeId);
  if (!store) throw new Error('Store not found');

  const newProduct: Product = {
    ...productData,
    id: getNextId()
  };

  if (!store.products) store.products = [];
  store.products.push(newProduct);
  saveData();
  return newProduct;
};

export const updateProductQuantity = (productId: number, quantity: number): void => {
  for (const store of stores.value) {
    const product = store.products?.find(p => p.id === productId);
    if (product) {
      product.quantity = quantity;
      saveData();
      return;
    }
  }
};

export const getStores = (): Store[] => {
  return stores.value;
};