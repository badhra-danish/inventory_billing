import api from "@/utils/axios";

const endPoint = {
  createPurchase: "v1/purchase/create",
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
