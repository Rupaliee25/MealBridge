import client from './client';

export const createOrder = async (itemId) => {
  const response = await client.post('/orders', { item_id: itemId });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await client.get('/orders/my');
  return response.data;
};