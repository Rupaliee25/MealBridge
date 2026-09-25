import client from './client';

export const getFoodItems = async () => {
  const response = await client.get('/food-items');
  return response.data;
};

export const getMyListings = async () => {
  const response = await client.get('/food-items/mine');
  return response.data;
};

export const createFoodItem = async (itemData) => {
  const response = await client.post('/food-items', itemData);
  return response.data;
};