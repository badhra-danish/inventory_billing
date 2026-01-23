import { axiosClient } from "..";

const EndPoint = {
  createCustomer: "/v1/customer/create",
  getAllCustomerPage: "/v1/customer/getcustomerpage",
  updateCustomer: "/v1/customer/update",
  deleteCustomer: "/v1/customer/delete",
  getAllCustomer: "v1/customer/getallcustomer",
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
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllCustomer = async () => {
  try {
    const res = await axiosClient.get(EndPoint.getAllCustomer);
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
      payload,
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
