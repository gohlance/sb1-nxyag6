import axios from 'axios';

export const createApiClient = (baseURL: string, apiKey: string) => {
  return axios.create({
    baseURL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
};