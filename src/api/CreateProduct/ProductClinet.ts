import { axiosClient } from "..";

const ProductEndPoint = {
  getAllProductPage: "/v1/product/getallproduct",
  createProduct: "/v1/product/create",
  getProductById: "/v1/product",
  getAllVariantByProduct: "/v1/product/getallvariantbyproduct",
};

export const createProduct = async (payload: object) => {
  try {
    const res = await axiosClient.post(ProductEndPoint.createProduct, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllProductPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(ProductEndPoint.getAllProductPage, {
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
    const res = await axiosClient.get(
      `${ProductEndPoint.getProductById}/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllVariantByProduct = async (id: string) => {
  try {
    const res = await axiosClient.get(
      `${ProductEndPoint.getAllVariantByProduct}/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
