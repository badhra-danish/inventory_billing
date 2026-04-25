import api from "@/utils/axios";
const attributeEndPoint = {
  createAttribute: "/v1/attribute/create",
  getAllAttributePage: "/v1/attribute/getattributepage",
  getAllAttributeAll: "/v1/attribute/getattributepage",
  deleteAttribute: "/v1/attribute/delete",
  updateAttribute: "/v1/attribute/update",
};
export const getAllVaariantAttribute = async (
  pageNo: number,
  pageSize: number,
) => {
  try {
    const res = await api.get(attributeEndPoint.getAllAttributePage, {
      params: {
        // pageNumber: pageNo,
        // pageSize: pageSize,
        // sortParameter: "name",
        // sortDesc: false,
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
export const getAllVaariantAttributeAll = async () => {
  try {
    const res = await api.get(attributeEndPoint.getAllAttributeAll);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAttribute = async (payload: object) => {
  try {
    const res = await api.post(attributeEndPoint.createAttribute, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAttribute = async (id: string, payload: object) => {
  try {
    const res = await api.put(
      `${attributeEndPoint.updateAttribute}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export const deleteAttribute = async (id: string) => {
  try {
    const res = await api.delete(`${attributeEndPoint.deleteAttribute}/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
