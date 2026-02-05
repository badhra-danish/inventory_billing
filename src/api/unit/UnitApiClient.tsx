import { axiosClient } from "..";
import api from "@/utils/axios";
const unitEndpoint = {
  createUnit: "/v1/unit/create",
  getAllUnitPage: "/v1/unit/getunitpage",
  getAllUnitActive: "/v1/unit/getunitpage",
  updateUnit: "/v1/unit/update",
  deleteUnit: "/v1/unit/delete",
};
export const createUnit = async (payload: object) => {
  try {
    const res = await api.post(unitEndpoint.createUnit, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllUnit = async (pageNo: number, pageSize: number) => {
  try {
    const res = api.get(unitEndpoint.getAllUnitPage, {
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
export const getAllUnitActive = async () => {
  try {
    const res = api.get(unitEndpoint.getAllUnitActive);
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUnit = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${unitEndpoint.updateUnit}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteUnit = async (id: string) => {
  try {
    const res = await api.delete(`${unitEndpoint.deleteUnit}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
