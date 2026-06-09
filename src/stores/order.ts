import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('order', {
  actions: {
    async createOrder(order: any) {
      try {
        const response = await axios.post('/api/orders', order);
        return response.data;
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },
  },
});
