import { axiosClient } from "..";
import api from "@/utils/axios";
const endPoint = {
  createStock: "v1/stock/create",
  getAllStockPage: "v1/stock/getallstockpage",
  updateStockQuantity: "v1/stock/updatequantity",
  deleteStock: "v1/stock/delete",
  searchVarintInstock: "v1/stock/getvariantinstock",
};

export const createStock = async (payload: object) => {
  try {
    const res = await api.post(endPoint.createStock, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllStockPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(endPoint.getAllStockPage, {
      params: {
        page: pageNo,
        limit: pageSize,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateStockQuantity = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endPoint.updateStockQuantity}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllVariantInstock = async (query: string) => {
  try {
    const res = await api.get(endPoint.searchVarintInstock, {
      params: {
        q: query,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const deleteStock = async (id: string) => {
  try {
    const res = await api.delete(`${endPoint.deleteStock}/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
