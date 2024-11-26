<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../types';

const props = defineProps<{
  storeId: number;
}>();

const emit = defineEmits<{
  (e: 'add-product', product: Omit<Product, 'id'>): void;
}>();

const name = ref('');
const quantity = ref(0);

const handleSubmit = () => {
  if (name.value && quantity.value >= 0) {
    emit('add-product', {
      name: name.value,
      quantity: quantity.value,
      storeId: props.storeId
    });
    
    // Reset form
    name.value = '';
    quantity.value = 0;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <h3>Ajouter un produit</h3>
    
    <div class="form-group">
      <label for="product-name">Nom du produit:</label>
      <input 
        id="product-name"
        v-model="name"
        type="text"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="quantity">Quantité:</label>
      <input 
        id="quantity"
        v-model="quantity"
        type="number"
        min="0"
        required
      />
    </div>
    
    <button type="submit">Ajouter le produit</button>
  </form>
</template>

<style scoped>
.product-form {
  margin-top: 15px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #2196F3;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1976D2;
}
</style>