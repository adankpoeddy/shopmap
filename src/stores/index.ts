import { ref } from 'vue';
import type { Store } from '../types';

const STORAGE_KEY = 'store-locations';
let currentId = parseInt(localStorage.getItem('store-last-id') || '0');

const getNextId = (): number => {
  currentId += 1;
  localStorage.setItem('store-last-id', currentId.toString());
  return currentId;
};

export const stores = ref<Store[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
);

export const saveStores = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stores.value));
};

export const addStore = (storeData: Omit<Store, 'id'>): Store => {
  const newStore: Store = {
    ...storeData,
    id: getNextId(),
  };
  stores.value.push(newStore);
  saveStores();
  return newStore;
};

export const getStores = (): Store[] => {
  return stores.value;
};