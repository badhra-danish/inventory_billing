import api from "@/utils/axios";
const endpoint = {
  createSales: "v1/sale/create",
  getAllSalesInfo: "v1/sale/getallsale",
  getAllInvoiceInfo: "v1/sale/getallinvoice",
  getAllInvoiceNo: "v1/sale/getallinvoiceno",
  createPayment: "v1/sale/createpayment",
  updateSale: "v1/sale/update",
  getAllPayment: "v1/sale/getallpayment",
  getSaleById: "v1/sale/getsalebyid",
  updatePayment: "v1/sale/updatepayment",
  deleteSale: "v1/sale/deletepayment",
};

export const createSales = async (payload: object) => {
  try {
    const res = await api.post(endpoint.createSales, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateSale = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endpoint.updateSale}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSalesInfo = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(endpoint.getAllSalesInfo, {
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
export const getAllInvoiceInfo = async (pageNo: number, pageSize: number) => {
  try {
    const res = await api.get(endpoint.getAllInvoiceInfo, {
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
export const getAllInvoiceNo = async () => {
  try {
    const res = await api.get(endpoint.getAllInvoiceNo);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getSaleById = async (id: string) => {
  try {
    const res = await api.get(`${endpoint.getSaleById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createPayment = async (id: string, payload: object) => {
  try {
    const res = await api.post(`${endpoint.createPayment}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePayment = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endpoint.updatePayment}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePayment = async (id: string) => {
  try {
    const res = await api.delete(`${endpoint.deleteSale}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPaymentDetials = async (id: string) => {
  try {
    const res = await api.get(`${endpoint.getAllPayment}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
