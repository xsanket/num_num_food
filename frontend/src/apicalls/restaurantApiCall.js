import { axiosInstance } from "./apicall.js";


export const restaurantLogin = async (payload) => {
  const response = await axiosInstance("post", "./api/restaurant-login", payload);
  return response;
};

export const restaurantRegistration = async (payload) => {
  const response = await axiosInstance("post", "./api/restaurant-registration", payload);
  return response;
};

export const getRestaurant = async () => {
  const response = axiosInstance("get", "/api/get-restaurant");
  return response;
}


export const getOrderDashboard = async () => {
  const response = axiosInstance("get", "/api/orders/pending");
  return response;
}






