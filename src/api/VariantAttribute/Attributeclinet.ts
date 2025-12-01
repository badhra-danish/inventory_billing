import { Rss } from "lucide-react";
import { axiosClient } from "..";

const attributeEndPoint = {
  createAttribute: "/v1/attribute/create",
  getAllAttributePage: "/v1/attribute/page",
  getAllAttributeAll: "/v1/attribute/all",
  deleteAttribute: "/v1/attribute/delete",
  updateAttribute: "/v1/attribute/update",
};
export const getAllVaariantAttribute = async (
  pageNo: number,
  pageSize: number
) => {
  try {
    const res = await axiosClient.get(attributeEndPoint.getAllAttributePage, {
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
export const getAllVaariantAttributeAll = async () => {
  try {
    const res = await axiosClient.get(attributeEndPoint.getAllAttributeAll);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAttribute = async (payload: object) => {
  try {
    const res = await axiosClient.post(
      attributeEndPoint.createAttribute,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAttribute = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${attributeEndPoint.updateAttribute}/${id}`,
      payload
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};
export const deleteAttribute = async (id: string) => {
  try {
    const res = await axiosClient.delete(
      `${attributeEndPoint.deleteAttribute}/${id}`
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
