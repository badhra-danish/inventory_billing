import { axiosClient } from "..";

const endPoint = {
  createWarriant: "/v1/warranty/create",
  updateWarriant: "/v1/warranty/update",
  getAllWarriantPage: "/v1/warranty/getwarrantypage",
  getAllWarranties: "/v1/warranty/getwarrantypage",
  deleteWarriant: "/v1/warranty/delete",
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
export const getAllWarranties = async () => {
  try {
    const res = axiosClient.get(endPoint.getAllWarranties);
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
