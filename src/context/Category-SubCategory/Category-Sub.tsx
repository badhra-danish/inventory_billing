import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllCategory,
  getAllCategoryall,
  getAllSubCategory,
  getAllSubcategoryByCategory,
} from "@/api/Category-subCategory/ApiClient";
import { getAllBrandActive } from "@/api/brand/BrandApiClient";
import { getAllUnitActive } from "@/api/unit/UnitApiClient";
export interface Category {
  categoryID: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface Brand {
  brandID: string;
  name: string;
}
export interface Unit {
  unitID: string;
  name: string;
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
  brand: Brand[];
  subCategories: SubCategory[];
  unit: Unit[];
  loading: boolean;
  refreshCategories: () => void;
  refreshSubCategories: (id: string) => void;
  refreshBrand: () => void;
  refreshUnit: () => void;
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
  const [brand, SetBrand] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
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
        setCategories(res.data || []);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  //Fetch Brand
  const refreshBrand = async () => {
    setLoading(true);
    try {
      const res = await getAllBrandActive();
      if (res?.statusCode === 200) {
        SetBrand(res.data || []);
      }
    } catch (error) {
      console.log("Error fetching Brand:", error);
    } finally {
      setLoading(false);
    }
  };
  const refreshUnit = async () => {
    setLoading(true);
    try {
      const res = await getAllUnitActive();
      if (res?.statusCode === 200) {
        setUnit(res.data || []);
      }
    } catch (error) {
      console.log("Error fetching Unit:", error);
    } finally {
      setLoading(false);
    }
  };
  const refreshSubCategories = async (id: string) => {
    setLoading(true);
    try {
      const res = await getAllSubcategoryByCategory(id);
      setSubCategories(res?.data || []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBrand();
    refreshCategories();
    refreshUnit;
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        brand,
        subCategories,
        unit,
        categoryPageMetaData,
        refreshBrand,
        refreshCategories,
        refreshSubCategories,
        refreshUnit,
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
