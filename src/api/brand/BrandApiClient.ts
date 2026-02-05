import { axiosClient } from "..";
import api from "@/utils/axios";
const brandEndPoint = {
  getAllbrand: "/v1/brand/getbrandpage",
  createBrand: "/v1/brand/create",
  updateBrand: "/v1/brand/update",
  deleteBrand: "/v1/brand/delete",
  getAllBrandActive: "/v1/brand/getbrandpage",
};

export const createBrand = async (payload: object) => {
  try {
    const res = await api.post(brandEndPoint.createBrand, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllBrand = async (pageNo: number, pageSize: number) => {
  try {
    const res = api.get(brandEndPoint.getAllbrand, {
      params: {
        pageNumber: pageNo,
        pageSize: pageSize,
        sortParameter: "name",
        sortDesc: false,
      },
    });
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllBrandActive = async () => {
  try {
    const res = api.get(brandEndPoint.getAllBrandActive);
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const upadateBrand = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${brandEndPoint.updateBrand}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBrand = async (id: string) => {
  try {
    const res = await api.delete(`${brandEndPoint.deleteBrand}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
