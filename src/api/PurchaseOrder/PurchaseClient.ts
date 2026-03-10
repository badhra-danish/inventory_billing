import api from "@/utils/axios";

const endPoint = {
  createPurchase: "v1/purchase/create",
  getAllPurchaseInfo: "v1/purchase/getallpurchaseinfo",
  getPurchaseById: "v1/purchase/getpurchasebyid",
  updatePuchase: "v1/purchase/update",
  createPayment: "v1/purchase/createpuchasepayment",
  getAllPurchasePayment: "v1/purchase/getallpaymentpurchase",
  updataPaymentPurchase: "v1/purchase/updatepaymentpurchase",
  deletePurchasePayment: "v1/purchase/deletepurchasepayment",
};

export const createPurchase = async (payload: object) => {
  try {
    const res = await api.post(endPoint.createPurchase, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePurchase = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endPoint.updatePuchase}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPurchase = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(endPoint.getAllPurchaseInfo, {
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
export const getPurchaseByID = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getPurchaseById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPurchasePayment = async (id: string, payload: object) => {
  try {
    const res = await api.post(`${endPoint.createPayment}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPaymentDetialsPurchase = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getAllPurchasePayment}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePaymentPurchase = async (id: string, payload: object) => {
  try {
    const res = await api.put(
      `${endPoint.updataPaymentPurchase}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePaymentPurchase = async (id: string) => {
  try {
    const res = await api.delete(`${endPoint.deletePurchasePayment}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
