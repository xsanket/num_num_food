import { axiosInstance } from "./apicall.js";

//fetch live order
export const getOrder = async (email) => {
  const response = axiosInstance("get", `/api/order?email=${email}`);
  return response;
}
//Delete live order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axiosInstance('delete', `/api/order/${orderId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete order');
  }
};
 
export const testOrder = async (payload) => {
  const response = axiosInstance("post", '/api/order', payload);
  return response;
}
