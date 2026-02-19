import api from "@/utils/axios";

const endPoint = {
  createPurchaseOrder: "v1/purchaseorder/createpurchaseorder",
  getAllPurchaseOrder: "v1/purchaseorder/getallpurchaseorder",
};

export const createPurchaseOrder = async (payload: object) => {
  try {
    const res = await api.post(endPoint.createPurchaseOrder, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPurchaseOrder = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(endPoint.getAllPurchaseOrder, {
      params: {
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
