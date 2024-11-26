export interface Product {
  id: number;
  name: string;
  quantity: number;
  storeId: number;
}

export interface Store {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  products?: Product[];
}