import client from './client';

export const getMyReceiverProfile = async () => {
  const response = await client.get('/receiver-profile/me');
  return response.data;
};
