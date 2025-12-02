import { axiosClient } from "../index";

const endPoint = {
  createCetogory: "/v1/category/create",
  getAllCategoryPage: "/v1/category/page",
  getAllCategorall: "/v1/category/all",
  subCategory: "/v1/sub-category/create",
  getAllSubCategory: "/v1/sub-category/page",
  getAllSubcategoryByCategory: "/v1/sub-category/all",
  updateCategory: "/v1/category/update",
  updateSubCategory: "/v1/sub-category/update",
  updateSubCategoryImage: "/v1/sub-category/update/image",
  deleteCategory: "/v1/category/delete",
  deleteSubcategory: "/v1/sub-category/delete",
};

export const createCategory = async (payload: object) => {
  try {
    const res = axiosClient.post(endPoint.createCetogory, payload);
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllCategory = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(endPoint.getAllCategoryPage, {
      params: {
        pageNumber: pageNo,
        pageSize: pageSize,
        sortDesc: false,
        sortParameter: "name",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllCategoryall = async () => {
  try {
    const res = await axiosClient.get(endPoint.getAllCategorall);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSubCategory = async (formData: FormData) => {
  try {
    const res = axiosClient.post(endPoint.subCategory, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return (await res).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllSubCategory = async (pageNo: number, pageSize: number) => {
  try {
    const res = await axiosClient.get(endPoint.getAllSubCategory, {
      params: {
        pageNumber: pageNo,
        pageSize: pageSize,
        sortDesc: false,
        sortParameter: "name",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllSubcategoryByCategory = async (id: string) => {
  try {
    const res = await axiosClient.get(
      `${endPoint.getAllSubcategoryByCategory}/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateCategory = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${endPoint.updateCategory}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateSubCategory = async (id: string, payload: object) => {
  try {
    const res = await axiosClient.put(
      `${endPoint.updateSubCategory}/${id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateSubCategoryImage = async (
  id: string,
  formData: FormData
) => {
  try {
    const res = await axiosClient.patch(
      `${endPoint.updateSubCategoryImage}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data1",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteCategory = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${endPoint.deleteCategory}/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteSubCategory = async (id: string) => {
  try {
    const res = await axiosClient.delete(`${endPoint.deleteSubcategory}/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
