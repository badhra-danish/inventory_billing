import api from "@/utils/axios";
const endPoint = {
  createShopUser: "v1/auth/createshopadmin",
};

export const createUserShop = async (payload: object) => {
  try {
    const res = await api.post(endPoint.createShopUser, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
