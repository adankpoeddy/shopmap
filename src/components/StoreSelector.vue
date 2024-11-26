<script setup lang="ts">
import { computed } from 'vue';
import type { Store } from '../types';

const props = defineProps<{
  stores: Store[];
  selectedStoreId: number | null;
}>();

const emit = defineEmits<{
  (e: 'select-store', storeId: number): void;
}>();

const sortedStores = computed(() => {
  return [...props.stores].sort((a, b) => a.name.localeCompare(b.name));
});

const handleStoreSelect = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const storeId = parseInt(select.value);
  emit('select-store', storeId);
};
</script>

<template>
  <div class="store-selector">
    <h3>Gestion des produits</h3>
    <div class="form-group">
      <label for="store-select">Sélectionner une boutique:</label>
      <select
        id="store-select"
        :value="selectedStoreId || ''"
        @change="handleStoreSelect"
        class="store-select"
      >
        <option value="" disabled>Choisir une boutique</option>
        <option
          v-for="store in sortedStores"
          :key="store.id"
          :value="store.id"
        >
          {{ store.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.store-selector {
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
  color: #555;
}

.store-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.store-select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style>