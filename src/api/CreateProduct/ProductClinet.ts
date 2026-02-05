import { axiosClient } from "..";
import api from "@/utils/axios";
const ProductEndPoint = {
  getAllProductPage: "/v1/product/getallproduct",
  createProduct: "/v1/product/create",
  getProductById: "/v1/product",

  // Variant
  addvariant: "/v1/product/addproductvariant",
  getAllVariantByProduct: "/v1/product/getallvariantbyproduct",
  getAllVariantBySearch: "/v1/product/getvariantbysearch",
  updateVariant: "/v1/product/upadatevariant",
  updateProduct: "/v1/product/updateproduct",

  deleteVariant: "/v1/product/deletevariant",
  deleteProduct: "/v1/product/deleteproduct",
};

export const createProduct = async (payload: object) => {
  try {
    const res = await api.post(ProductEndPoint.createProduct, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllProductPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(ProductEndPoint.getAllProductPage, {
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
export const getProductById = async (id: string) => {
  try {
    const res = await api.get(`${ProductEndPoint.getProductById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllVariantByProduct = async (id: string) => {
  try {
    const res = await api.get(
      `${ProductEndPoint.getAllVariantByProduct}/${id}`,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllVariantBySearch = async (query: string) => {
  try {
    const res = await api.get(ProductEndPoint.getAllVariantBySearch, {
      params: {
        query: query,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateVariant = async (id: string, payload: object) => {
  try {
    const res = await api.put(
      `${ProductEndPoint.updateVariant}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateProduct = async (id: string, payload: object) => {
  try {
    const res = await api.put(
      `${ProductEndPoint.updateProduct}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVariant = async (id: string, payload: object) => {
  try {
    const res = await api.post(`${ProductEndPoint.addvariant}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteVariant = async (id: string) => {
  try {
    const res = await api.delete(`${ProductEndPoint.deleteVariant}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`${ProductEndPoint.deleteProduct}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
