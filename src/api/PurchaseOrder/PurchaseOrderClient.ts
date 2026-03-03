import api from "@/utils/axios";

const endPoint = {
  createPurchaseOrder: "v1/purchaseorder/createpurchaseorder",
  getAllPurchaseOrder: "v1/purchaseorder/getallpurchaseorder",
  getPurchaseOrderById: "v1/purchaseorder/getpurchaseorderid",
  updatePurchaseOrder: "v1/purchaseorder/updatepurchaseorder",
  getAllPurchaseOrderNo: "v1/purchaseorder/getallpurchaseorderno",
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
export const getAllPurchaseOrderNo = async () => {
  try {
    const res = await api.get(endPoint.getAllPurchaseOrderNo);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPurchaseOrderByID = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getPurchaseOrderById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePurchaseOrder = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endPoint.updatePurchaseOrder}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
