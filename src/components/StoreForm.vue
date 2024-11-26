<script setup lang="ts">
import { ref } from 'vue';
import type { Store, Product } from '../types';
import ProductForm from './ProductForm.vue';
import StoreSelector from './StoreSelector.vue';

const emit = defineEmits<{
  (e: 'add-store', store: Omit<Store, 'id'>): void;
  (e: 'add-product', storeId: number, product: Omit<Product, 'id'>): void;
}>();

const props = defineProps<{
  stores: Store[];
}>();

const name = ref('');
const latitude = ref('');
const longitude = ref('');
const selectedStoreId = ref<number | null>(null);

const handleSubmit = () => {
  if (name.value && latitude.value && longitude.value) {
    emit('add-store', {
      name: name.value,
      latitude: Number(latitude.value),
      longitude: Number(longitude.value),
    });
    
    // Reset form
    name.value = '';
    latitude.value = '';
    longitude.value = '';
  }
};

const handleAddProduct = (product: Omit<Product, 'id'>) => {
  if (selectedStoreId.value) {
    emit('add-product', selectedStoreId.value, product);
  }
};

const handleStoreSelect = (storeId: number) => {
  selectedStoreId.value = storeId;
};
</script>

<template>
  <div class="forms-container">
    <div class="form-section">
      <form @submit.prevent="handleSubmit" class="store-form">
        <h3>Ajouter une boutique</h3>
        
        <div class="form-group">
          <label for="name">Nom de la boutique:</label>
          <input 
            id="name"
            v-model="name"
            type="text"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="latitude">Latitude:</label>
          <input 
            id="latitude"
            v-model="latitude"
            type="number"
            step="any"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="longitude">Longitude:</label>
          <input 
            id="longitude"
            v-model="longitude"
            type="number"
            step="any"
            required
          />
        </div>
        
        <button type="submit">Ajouter la boutique</button>
      </form>
    </div>

    <div class="form-section">
      <StoreSelector 
        :stores="props.stores"
        :selected-store-id="selectedStoreId"
        @select-store="handleStoreSelect"
      />

      <ProductForm 
        v-if="selectedStoreId"
        :store-id="selectedStoreId"
        @add-product="handleAddProduct"
      />
    </div>
  </div>
</template>

<style scoped>
.forms-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.store-form {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>