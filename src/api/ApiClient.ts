import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL,// our backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});
const endPoint = {
  createCetogory: "/v1/category/create",
  getAllCategory: "/v1/category/all",
  subCategory:"/v1/sub-category/create",
  getAllSubCategory:"/v1/sub-category/all",
  updateCategory : "/v1/category/update",
  deleteCategory:"/v1/category/delete/"
};




export const createCategory = async (payload :object) => {
  try {
    const res = axiosClient.post(endPoint.createCetogory ,payload);
    return (await res);
  } catch (error) {
    console.error(error);
  }
};

export const getAllCategory = async () => {
  try {
    const res = await axiosClient.get(endPoint.getAllCategory);
    return res.data;
  } catch (error) {
    console.error( error)
  }
}


export const createSubCategory = async (formData :FormData) => {
  try {
    const res = axiosClient.post(endPoint.subCategory ,formData,{
      headers :{
        "Content-Type" : "multipart/form-data1"
      }
    });
    return (await res).data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllSubCategory = async () => {
  try {
    const res = await axiosClient.get(endPoint.getAllSubCategory);
    return res.data;
  } catch (error) {
    console.error( error)
  }
}

export const updateCategory = async(id :string, payload : object) => {
try {
  const res = await axiosClient.put(`${endPoint.updateCategory}/${id}`,payload);
  return res.data;
} catch (error) {
  console.error(error)
}
}

export const deleteCategory = async(id :string) => {
try {
  const res = await axiosClient.delete(`${endPoint.deleteCategory}/${id}`);
  return res;
} catch (error) {
  console.error(error)
}
}