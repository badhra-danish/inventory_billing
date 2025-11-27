import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllCategory,
  getAllCategoryall,
  getAllSubCategory,
} from "@/api/Category-subCategory/ApiClient";
export interface Category {
  categoryID: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface SubCategory {
  subCategoryID: string;
  imageUrl: string;
  name: string;
  code: string;
  description: string;
  categoryName: string;
  status: "ACTIVE" | "INACTIVE";
}
type CategoryContextType = {
  categories: Category[];
  subCategories: SubCategory[];
  loading: boolean;
  refreshCategories: (page: number, pageSize: number) => void;
  refreshSubCategories: () => void;
  categoryPageMetaData: {
    totalPages: number;
    totalElements: number;
    elementCountInCurrentPage: number;
    currentPageNumber: number;
  };
};

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoryPageMetaData, setCategoryPageMetaData] = React.useState({
    totalPages: 0,
    totalElements: 0,
    elementCountInCurrentPage: 0,
    currentPageNumber: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const refreshCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoryall();
      if (res?.statusCode === 200) {
        // append or replace depending on page
        setCategories(res.data || []);
        // setCategories((prev) =>
        //   page > 1 ? [...prev, ...(res.data || [])] : res.data || []
        // );
        //setCategories((prev) => [...prev, ...res.data]);
        // setCategoryPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubCategories = async (
    page: number = 1,
    pageSize: number = 10
  ) => {
    setLoading(true);
    try {
      const res = await getAllSubCategory(page, pageSize);
      setSubCategories(res?.data || []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubCategories();
    refreshCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        subCategories,
        categoryPageMetaData,
        refreshCategories,
        refreshSubCategories,
        loading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const cat = useContext(CategoryContext);
  if (!cat) throw new Error("useCategory must be inside CategoryProvider");
  return cat;
};
