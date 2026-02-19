import api from "@/utils/axios";

const endPoint = {
  create: "v1/warehouse/create",
  getallWarehousePage: "v1/warehouse/getallwarehouse",
  update: "v1/warehouse/update",
  delete: "v1/warehouse/delete",
};

export const createWarehouse = async (payload: object) => {
  try {
    const res = await api.post(endPoint.create, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllWarehousePage = async (pageNo: number, pageSize: number) => {
  try {
    const res = api.get(endPoint.getallWarehousePage, {
      params: {
        page: pageNo,
        limit: pageSize,
      },
    });
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllWarehouse = async () => {
  try {
    const res = api.get(endPoint.getallWarehousePage);
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateWarehouse = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endPoint.update}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteWarehouse = async (id: string) => {
  try {
    const res = await api.delete(`${endPoint.delete}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
