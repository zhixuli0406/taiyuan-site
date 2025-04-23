import api from './config'

/**
 * Fetches the list of carousels from the API.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of carousel objects.
 */
export const fetchCarousels = async () => {
  try {
    const response = await api.get('/carousel');
    // Assuming the API returns data in the format { carousels: [...] }
    return response.data.carousels || [];
  } catch (error) {
    console.error('Error fetching carousels:', error);
    // Rethrow the error or handle it as needed
    throw error;
  }
}; 