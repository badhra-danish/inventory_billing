import { axiosClient } from "..";

const ProductEndPoint = {
  getAllProductPage: "/v1/products/page",
  createProduct: "/v1/products/create",
  getProductById: "/v1/products",
};

export const createProduct = async (payload: object) => {
  try {
    const res = await axiosClient.post(
      ProductEndPoint.createProduct,
      payload,
      {}
    );
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
        pageNumber: pageNo,
        pageSize: pageSize,
        sortParameter: "name",
        sortDesc: false,
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
