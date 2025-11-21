import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllCategory, getAllSubCategory } from "@/api/ApiClient";
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
  refreshCategories: () => void;
  refreshSubCategories: () => void;
};

const CategoryContext = createContext<CategoryContextType | null>(null);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const refreshCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategory();
      if (res?.statusCode === 200) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllSubCategory();
      setSubCategories(data || []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCategories();
    refreshSubCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        subCategories,
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
