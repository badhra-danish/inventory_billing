import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllCategoryall,
  getAllSubcategoryByCategory,
} from "@/api/Category-subCategory/ApiClient";
import { getAllBrandActive } from "@/api/brand/BrandApiClient";
import { getAllUnitActive } from "@/api/unit/UnitApiClient";
import type { Warranty } from "@/components/inventory/WarrantieDataTable";
import { getAllWarranties } from "@/api/Warranty/Warranty";
export interface Category {
  category_id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface Brand {
  brand_id: string;
  brandName: string;
}
export interface Unit {
  unit_id: string;
  unitName: string;
}

export interface SubCategory {
  subCategory_id: string;
  subCategoryName: string;
  categoryCode: string;
  description: string;
  categoryName: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface Wrranty {
  warranty_id: string;
  warrantyName: string;
  desription: string;
  period: "YEAR" | "MONTH";
  duration: number;
  status: "ACTIVE" | "INACTIVE";
}
type CategoryContextType = {
  categories: Category[];
  brand: Brand[];
  subCategories: SubCategory[];
  unit: Unit[];
  warranty: Warranty[];
  loading: boolean;

  refreshCategories: () => void;
  refreshSubCategories: (id: string) => void;
  refreshBrand: () => void;
  refreshUnit: () => void;
  refreshWarranty: () => void;
  // refreshWarranty: () => void;
  // categoryPageMetaData: {
  //   totalPages: number;
  //   totalElements: number;
  //   elementCountInCurrentPage: number;
  //   currentPageNumber: number;
  // };
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
  const [warranty, setWarranty] = useState<Warranty[]>([]);
  // const [categoryPageMetaData, setCategoryPageMetaData] = React.useState({
  //   totalPages: 0,
  //   totalElements: 0,
  //   elementCountInCurrentPage: 0,
  //   currentPageNumber: 0,
  // });
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const refreshCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoryall();
      if (res?.status === "OK") {
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
      if (res?.status === "OK") {
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
      if (res?.status === "OK") {
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
  const refreshWarranty = async () => {
    setLoading(true);
    try {
      const res = await getAllWarranties();
      setWarranty(res?.data || []);
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
        warranty,
        // categoryPageMetaData,
        refreshBrand,
        refreshWarranty,
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
