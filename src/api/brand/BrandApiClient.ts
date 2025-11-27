import { axiosClient } from "..";

const brandEndPoint = {
  getAllbrand: "/v1/brand/page",
  createBrand: "/v1/brand/create",
  updateBrand: "/v1/brand/update",
  deleteBrand: "/v1/brand/delete",
};

export const createBrand = async (payload: object) => {
  try {
    const res = await axiosClient.post(brandEndPoint.createBrand, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllBrand = async (pageNo: number, pageSize: number) => {
  try {
    const res = axiosClient.get(brandEndPoint.getAllbrand, {
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

export const upadateBrand = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${brandEndPoint.updateBrand}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBrand = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${brandEndPoint.deleteBrand}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
