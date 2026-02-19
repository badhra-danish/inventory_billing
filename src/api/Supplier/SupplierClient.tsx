import { axiosClient } from "..";
import api from "@/utils/axios";
const EndPoint = {
  createSupplier: "/v1/supplier/create",
  getAllSupplierPage: "/v1/supplier/getsupplierpage",
  updateSuppliers: "/v1/supplier/update",
  deleteSupplier: "/v1/supplier/delete",
};

export const createSupplier = async (payload: object) => {
  try {
    const res = await api.post(EndPoint.createSupplier, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSupplierPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(EndPoint.getAllSupplierPage, {
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
export const getAllSupplier = async () => {
  try {
    const res = await api.get(EndPoint.getAllSupplierPage);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateSupplier = async (payload: object, id: string) => {
  try {
    const res = await api.put(`${EndPoint.updateSuppliers}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteSupplier = async (id: string) => {
  try {
    const res = await api.delete(`${EndPoint.deleteSupplier}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
