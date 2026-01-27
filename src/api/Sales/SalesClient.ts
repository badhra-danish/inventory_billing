import { axiosClient } from "..";

const endpoint = {
  createSales: "v1/sale/create",
  getAllSalesInfo: "v1/sale/getallsale",
  createPayment: "v1/sale/createpayment",
  getAllPayment: "v1/sale/getallpayment",
  getSaleById: "v1/sale/getsalebyid",
  updatePayment: "v1/sale/updatepayment",
  deleteSale: "v1/sale/deletepayment",
};

export const createSales = async (payload: object) => {
  try {
    const res = await axiosClient.post(endpoint.createSales, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSalesInfo = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(endpoint.getAllSalesInfo, {
      params: {
        page: pageNo,
        limit: pageSize,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getSaleById = async (id: string) => {
  try {
    const res = await axiosClient.get(`${endpoint.getSaleById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPayment = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.post(
      `${endpoint.createPayment}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePayment = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${endpoint.updatePayment}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePayment = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${endpoint.deleteSale}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPaymentDetials = async (id: string) => {
  try {
    const res = await axiosClient.get(`${endpoint.getAllPayment}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
