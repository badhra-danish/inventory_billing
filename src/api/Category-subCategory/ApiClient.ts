import { axiosClient } from "../index";

const endPoint = {
  createCetogory: "/v1/category/create",
  getAllCategoryPage: "/v1/category/getCategoryPage",
  getAllCategorall: "/v1/category/getCategoryPage",
  deleteCategory: "/v1/category/delete",
  updateCategory: "/v1/category/update",

  subCategory: "/v1/subcategory/create",
  getAllSubCategory: "/v1/subcategory/getSubCategoryPage",
  getAllSubcategoryByCategory: "/v1/subcategory/getsubcategorybycategory",
  updateSubCategory: "/v1/subcategory/update",
  // updateSubCategoryImage: "/v1/sub-category/update/image",
  deleteSubcategory: "/v1/subcategory/delete",
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

export const getAllCategoryall = async () => {
  try {
    const res = await axiosClient.get(endPoint.getAllCategorall);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSubCategory = async (payload: object) => {
  try {
    const res = axiosClient.post(endPoint.subCategory, payload);
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
// export const updateSubCategoryImage = async (
//   id: string,
//   formData: FormData
// ) => {
//   try {
//     const res = await axiosClient.patch(
//       `${endPoint.updateSubCategoryImage}/${id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data1",
//         },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
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
