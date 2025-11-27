import { axiosClient } from "..";

const unitEndpoint = {
  createUnit: " ",
  getAllUnitPage: "/v1/unit/page",
};

export const getAllUnit = async (pageNo: number, pageSize: number) => {
  try {
    const res = axiosClient.get(unitEndpoint.getAllUnitPage, {
      params: {
        pageNumber: pageNo,
        pageSize: pageSize,
        sortParameter: "name",
        sortDesc: false,
      },
    });
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
