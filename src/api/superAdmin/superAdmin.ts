import api from "@/utils/axios";
const endPoint = {
  createShopUser: "v1/auth/createshopadmin",
  getAllShopAdmin: "v1/auth/getallshopadmin",
  updateShopUser: "v1/auth/updateshopadmin",
  getDashboardData: "v1/auth/dashboard/superadminstats",
  getShopAdminStats: "v1/auth/dashboard/shopadminstats",
  getAnalystic: "v1/auth/dashboard/analytics",
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
export const getAllShopAdmin = async () => {
  try {
    const res = await api.get(endPoint.getAllShopAdmin);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateShopUser = async (id: string, payload: object) => {
  try {
    const res = await api.put(`${endPoint.updateShopUser}/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDashbordSate = async () => {
  try {
    const res = await api.get(endPoint.getDashboardData);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getShopAdminStats = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getShopAdminStats}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getSalePurchaseAnalystic = async (id: string) => {
  try {
    const res = await api.get(`${endPoint.getAnalystic}/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
