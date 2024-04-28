import { axiosInstance } from "./apicall.js";


export const getCompletedOrders = async (email) => {
    const response = await axiosInstance("get", `/api/completed-order?email=${email}`)
    return response;

}