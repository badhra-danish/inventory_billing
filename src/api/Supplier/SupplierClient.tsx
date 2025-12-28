import { axiosClient } from "..";

const EndPoint = {
  createSupplier: "/v1/suppliers/create",
  getAllSupplierPage: "/v1/suppliers/page",
  updateSuppliers: "/v1/suppliers/update",
  deleteSupplier: "/v1/suppliers/delete",
};

export const createSupplier = async (payload: object) => {
  try {
    const res = await axiosClient.post(EndPoint.createSupplier, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSupplierPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(EndPoint.getAllSupplierPage, {
      params: {
        pageNumber: pageNo,
        pageSize: pageSize,
        sortParameter: "firstName",
        sortDesc: false,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSupplier = async (payload: object, id: string) => {
  try {
    const res = await axiosClient.put(
      `${EndPoint.updateSuppliers}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteSupplier = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${EndPoint.deleteSupplier}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
