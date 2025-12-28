import { axiosClient } from "..";

const EndPoint = {
  createCustomer: "/v1/customers/create",
  getAllCustomerPage: "/v1/customers/page",
  updateCustomer: "/v1/customers/update",
  deleteCustomer: "/v1/customers/delete",
};

export const createCustomer = async (payload: object) => {
  try {
    const res = await axiosClient.post(EndPoint.createCustomer, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllCustomertPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(EndPoint.getAllCustomerPage, {
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
export const updateCustomer = async (payload: object, id: string) => {
  try {
    const res = await axiosClient.put(
      `${EndPoint.updateCustomer}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteCustomer = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${EndPoint.deleteCustomer}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
