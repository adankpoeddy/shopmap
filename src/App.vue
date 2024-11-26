<script setup lang="ts">
import { onMounted, ref } from 'vue';
import StoreForm from './components/StoreForm.vue';
import StoreMap from './components/StoreMap.vue';
import type { Store, Product } from './types';
import { addStore, getStores, addProduct } from './stores/store';

const stores = ref<Store[]>([]);

onMounted(() => {
  stores.value = getStores();
});

const handleAddStore = (storeData: Omit<Store, 'id'>) => {
  const newStore = addStore(storeData);
  stores.value = getStores();
};

const handleAddProduct = (storeId: number, productData: Omit<Product, 'id'>) => {
  const newProduct = addProduct({ ...productData, storeId });
  stores.value = getStores();
};
</script>

<template>
  <div class="container">
    <h1>Mes Boutiques sur la Carte</h1>
    <StoreForm 
      :stores="stores"
      @add-store="handleAddStore"
      @add-product="handleAddProduct"
    />
    <StoreMap :stores="stores" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}
</style>