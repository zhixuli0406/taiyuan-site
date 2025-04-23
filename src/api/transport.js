import api from './config';

export const transportApi = {
  // 获取所有运输方式
  getAllTransports: async () => {
    try {
      const response = await api.get('/transports');
      return response.data;
    } catch (error) {
      console.error('获取运输方式失败:', error);
      throw error;
    }
  },

  // 获取单个运输方式
  getTransportById: async (id) => {
    try {
      const response = await api.get(`/transports/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取运输方式详情失败:', error);
      throw error;
    }
  },

  // 创建运输方式
  createTransport: async (transportData) => {
    try {
      const response = await api.post('/transports', transportData);
      return response.data;
    } catch (error) {
      console.error('创建运输方式失败:', error);
      throw error;
    }
  },

  // 更新运输方式
  updateTransport: async (id, transportData) => {
    try {
      const response = await api.put(`/transports/${id}`, transportData);
      return response.data;
    } catch (error) {
      console.error('更新运输方式失败:', error);
      throw error;
    }
  },

  // 删除运输方式
  deleteTransport: async (id) => {
    try {
      const response = await api.delete(`/transports/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除运输方式失败:', error);
      throw error;
    }
  }
}; 