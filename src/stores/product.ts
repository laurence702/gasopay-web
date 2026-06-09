import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as any[],
  }),
  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get('/api/products/rules');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
});
