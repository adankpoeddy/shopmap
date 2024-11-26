<script setup lang="ts">
import { onMounted, watch } from 'vue';
import type { Store } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const props = defineProps<{
  stores: Store[];
}>();

let map: L.Map;
let markers: L.Marker[] = [];

const storeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const createPopupContent = (store: Store): string => {
  const productsHtml = store.products && store.products.length
    ? `
      <div class="store-products">
        <h4>Produits en stock:</h4>
        <ul>
          ${store.products.map(product => `
            <li>${product.name}: ${product.quantity} unités</li>
          `).join('')}
        </ul>
      </div>
    `
    : '<p>Aucun produit en stock</p>';

  return `
    <div class="store-popup">
      <h3>${store.name}</h3>
      <p><strong>Coordonnées:</strong></p>
      <p>Latitude: ${store.latitude}</p>
      <p>Longitude: ${store.longitude}</p>
      ${productsHtml}
    </div>
  `;
};

onMounted(() => {
  map = L.map('map').setView([46.603354, 1.888334], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  updateMarkers();
});

const updateMarkers = () => {
  markers.forEach(marker => marker.remove());
  markers = [];
  
  props.stores.forEach(store => {
    const marker = L.marker([store.latitude, store.longitude], { icon: storeIcon })
      .bindPopup(createPopupContent(store), {
        maxWidth: 300,
        className: 'store-popup'
      })
      .bindTooltip(store.name, {
        permanent: false,
        direction: 'top'
      })
      .addTo(map);
    markers.push(marker);
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), {
      padding: [50, 50]
    });
  }
};

watch(() => props.stores, () => {
  updateMarkers();
}, { deep: true });
</script>

<template>
  <div id="map"></div>
</template>

<style>
#map {
  height: 500px;
  width: 100%;
  border-radius: 8px;
}

.store-popup {
  padding: 10px;
}

.store-popup h3 {
  margin: 0 0 10px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.store-popup h4 {
  margin: 10px 0 5px 0;
  color: #444;
}

.store-popup p {
  margin: 5px 0;
}

.store-popup ul {
  margin: 5px 0;
  padding-left: 20px;
}

.store-popup li {
  margin: 3px 0;
}

.store-popup small {
  color: #666;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-tooltip {
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
}

.leaflet-tooltip:before {
  border-top-color: #333;
}
</style>