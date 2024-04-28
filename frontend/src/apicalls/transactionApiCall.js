import { axiosInstance } from "./apicall.js";



export const orderTransaction = async(payload) => {
    const response = await axiosInstance('post',  '/api/transaction-order', payload)
    return response;

}

export const orderStatus = async (payload) =>{
    const response = await axiosInstance('post', '/api/status', payload)
    return response;
}