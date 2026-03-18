import { axiosClient } from "..";
import api from "@/utils/axios";
const endPoint = {
  createSaleReturn: "v1/salereturn/create",
  getAllSaleReturnInfo: "v1/salereturn/getallsalesreturn",
  getSalesById: "v1/salereturn/getsalesreturnbyid",
};

export const createSaleReturn = async (payload: object) => {
  try {
    const res = await api.post(endPoint.createSaleReturn, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSalesReturnInfo = async (
  pageNo: number,
  pageSize: number,
) => {
  try {
    const res = await api.get(endPoint.getAllSaleReturnInfo, {
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
export const getSaleReturnById = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getSalesById}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
