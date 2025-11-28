import { axiosClient } from "..";

const attributeEndPoint = {
  createAttribute: "/v1/attribute/create",
  getAllAttribute: "/v1/attribute/page",
};
export const getAllVaariantAttribute = async (
  pageNo: number,
  pageSize: number
) => {
  try {
    const res = await axiosClient.get(attributeEndPoint.getAllAttribute, {
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
