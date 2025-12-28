import axios from "axios";
import { axiosClient } from "..";

const endPoint = {
  createWarriant: "/v1/warranties/create",
  updateWarriant: "/v1/warranties/update",
  getAllWarriantPage: "/v1/warranties/page",
  deleteWarriant: "/v1/warranties/delete",
};

export const createWarranty = async (payload: object) => {
  try {
    const res = await axiosClient.post(endPoint.createWarriant, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllWarrantyPage = async (pageNo: number, pageSize: number) => {
  try {
    const res = axiosClient.get(endPoint.getAllWarriantPage, {
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
export const updateWarranty = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${endPoint.updateWarriant}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteWarranty = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${endPoint.deleteWarriant}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
