import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Calendar,
  Shield,
  Factory,
  Box,
  AlertCircle,
} from "lucide-react";
import { getProductById } from "@/api/CreateProduct/ProductClinet";
import { useParams } from "react-router-dom";
export interface Product {
  productID: string;
  productType: "single" | "variable";
  name: string;
  slug: string;
  sellingType: "RETAIL" | "WHOLESALE" | "BOTH";
  description: string;
  categoryName: string;
  subCategoryName: string;
  brandName: string;
  unitName: string;
  warranty: string;
  manufacturer: string;
  manufacturedDate: string;
  createAt: string;
  expiryDate: string;
  productVariation: ProductVariation[];
}

export interface ProductVariation {
  productVariationID: string;
  productMetaData: ProductMetaData;
  variationOptions: VariationOption[];
}

export interface ProductMetaData {
  sku: string;
  price: number;
  quantity: number;
  taxType: TaxType;
  taxValue: number;
  discountType: DiscountType;
  discountValue: number;
  quantityAlert: number;
}

export interface VariationOption {
  variationOptionID: string;
  attribute: string; // e.g. "Color"
  attributeValue: string; // e.g. "Red"
}

//  Reusable union types
export type TaxType = "NONE" | "EXCLUSIVE" | "INCLUSIVE";
export type DiscountType = "NONE" | "FIXED" | "PERCENTAGE";

const ProductDetails = () => {
  const productID = useParams();
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [product, setProductData] = React.useState<Product>();
  console.log(productID.product_id);

  const getProduct = async () => {
    try {
      if (!productID?.product_id) return;
      const res = await getProductById(productID.product_id);
      if (res.statusCode == 200) {
        setProductData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  //   productID: "bc02ad71-b0e3-4830-bdc2-3e6bc352cf6e",
  //   name: "Handle",
  //   slug: "handle",
  //   productType: "variable",
  //   sellingType: "BOTH",
  //   description:
  //     "this is the handle product which have the multiple variant color size and materials ",
  //   brandName: "Greenply",
  //   categoryName: "PLY",
  //   subCategoryName: "Play",
  //   unitName: "Sheets",
  //   warranty: "1-year",
  //   manufacturer: "Starlix",
  //   manufacturedDate: "2025-12-30",
  //   expiryDate: "2026-01-14",
  //   createAt: "2025-12-04",
  //   imageUrl: [
  //     "https://res.cloudinary.com/dzbts0k5s/image/upload/v1764833772/product_img/doctor5_f924060d-a303-4965-aeca-d455acd58515.jpg",
  //     "https://res.cloudinary.com/dzbts0k5s/image/upload/v1764833773/product_img/doctor6_ab0093b9-4034-407c-8f2c-bb1821d43fef.avif",
  //   ],
  //   productVariations: [
  //     {
  //       productVariationID: "d6e47c07-f3d3-44e6-b2ba-a1037207c93c",
  //       productMetaData: {
  //         sku: "H-101",
  //         price: 1200,
  //         quantity: 200,
  //         taxType: "NONE",
  //         taxValue: 0,
  //         discountType: "PERCENTAGE",
  //         discountValue: 5,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "green" },
  //         { attribute: "Size", attributeValue: "L" },
  //       ],
  //     },
  //     {
  //       productVariationID: "d6a668a7-7832-4412-b04c-bc7d1b57b492",
  //       productMetaData: {
  //         sku: "H-102",
  //         price: 1150,
  //         quantity: 200,
  //         taxType: "NONE",
  //         taxValue: 0,
  //         discountType: "NONE",
  //         discountValue: 0,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "green" },
  //         { attribute: "Size", attributeValue: "M" },
  //       ],
  //     },
  //     {
  //       productVariationID: "baff7950-4f59-4b3b-a005-5715f599c630",
  //       productMetaData: {
  //         sku: "H-103",
  //         price: 999,
  //         quantity: 200,
  //         taxType: "NONE",
  //         taxValue: 0,
  //         discountType: "PERCENTAGE",
  //         discountValue: 10,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "green" },
  //         { attribute: "Size", attributeValue: "S" },
  //       ],
  //     },
  //     {
  //       productVariationID: "fc8f9728-32b0-4d0b-8e46-ba90d1d9f9a0",
  //       productMetaData: {
  //         sku: "H-104",
  //         price: 1200,
  //         quantity: 200,
  //         taxType: "EXCLUSIVE",
  //         taxValue: 0,
  //         discountType: "NONE",
  //         discountValue: 2,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "Red" },
  //         { attribute: "Size", attributeValue: "L" },
  //       ],
  //     },
  //     {
  //       productVariationID: "762777e5-e203-4298-8a4a-895a55800038",
  //       productMetaData: {
  //         sku: "H-105",
  //         price: 1100,
  //         quantity: 200,
  //         taxType: "INCLUSIVE",
  //         taxValue: 0,
  //         discountType: "FIXED",
  //         discountValue: 50,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "Red" },
  //         { attribute: "Size", attributeValue: "M" },
  //       ],
  //     },
  //     {
  //       productVariationID: "e43b0904-7bdf-4c7a-b69f-32a7e6538eb5",
  //       productMetaData: {
  //         sku: "H-106",
  //         price: 850,
  //         quantity: 150,
  //         taxType: "EXCLUSIVE",
  //         taxValue: 0,
  //         discountType: "PERCENTAGE",
  //         discountValue: 2,
  //         quantityAlert: 10,
  //       },
  //       variationOptions: [
  //         { attribute: "Color", attributeValue: "Red" },
  //         { attribute: "Size", attributeValue: "S" },
  //       ],
  //     },
  //   ],
  // };

  const currentVariation = product?.productVariation?.[selectedVariation];

  const price = currentVariation?.productMetaData?.price ?? 0;
  const discountType =
    currentVariation?.productMetaData?.discountType ?? "NONE";
  const discountValue = currentVariation?.productMetaData?.discountValue ?? 0;

  let finalPrice = price;

  if (discountType === "FIXED") {
    finalPrice = price - discountValue;
  } else if (discountType === "PERCENTAGE") {
    finalPrice = price - (price * discountValue) / 100;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                {product?.name}
              </h1>

              <div className="flex gap-2 flex-wrap">
                <span className="p-2 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {product?.brandName.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ₹{finalPrice}
              </div>
              {currentVariation?.productMetaData.discountType === "FIXED" && (
                <div className="text-slate-400 line-through text-lg">
                  ₹{currentVariation.productMetaData.price}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" flex flex-col gap-5">
          {/* Images Section with Slider */}
          <div className="flex gap-3">
            {/* PRODUCT INFO  */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Tag className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Category</div>
                    <div className="font-medium text-slate-800">
                      {product?.categoryName} / {product?.subCategoryName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Factory className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Manufacturer</div>
                    <div className="font-medium text-slate-800">
                      {product?.manufacturer}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Warranty</div>
                    <div className="font-medium text-slate-800">
                      {product?.warranty}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Box className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Unit</div>
                    <div className="font-medium text-slate-800">
                      {product?.unitName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Manufactured</div>
                    <div className="font-medium text-slate-800">
                      {product?.manufacturedDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="text-xs text-slate-500">Expiry</div>
                    <div className="font-medium text-slate-800">
                      {product?.expiryDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}

            {/* Variations Selector with Slider */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Select Variation
              </h3>
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                  {product?.productVariation?.map((variation, idx) => {
                    const options = variation.variationOptions
                      .map((v) => `${v.attributeValue}`)
                      .join(" / ");
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariation(idx)}
                        className={`min-w-[200px] snap-start p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedVariation === idx
                            ? "border-blue-500 bg-blue-50 shadow-md "
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-800">
                          {options}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          SKU: {variation.productMetaData.sku}
                        </div>
                        <div className="text-lg font-bold text-green-600 mt-2">
                          ₹{variation.productMetaData.price}
                        </div>
                        {variation.productMetaData.discountType !== "NONE" && (
                          <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded mt-2 inline-block">
                            {variation.productMetaData.discountType ===
                              "FIXED" &&
                              `Save ₹${variation.productMetaData.discountValue}`}
                            {variation.productMetaData.discountType ===
                              "PERCENTAGE" &&
                              `Save ${variation.productMetaData.discountValue}%`}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Variation indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {product?.productVariation?.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariation(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedVariation === idx
                        ? "bg-blue-500 w-6"
                        : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Variation Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Variation Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    Price
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    ₹{currentVariation?.productMetaData.price}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">
                    In Stock
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {currentVariation?.productMetaData.quantity}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium mb-1">
                    Discount
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {currentVariation?.productMetaData.discountType ===
                      "NONE" && "None"}

                    {currentVariation?.productMetaData.discountType ===
                      "FIXED" &&
                      `₹${currentVariation.productMetaData.discountValue}`}

                    {currentVariation?.productMetaData.discountType ===
                      "PERCENTAGE" &&
                      `${currentVariation?.productMetaData.discountValue}%`}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="text-sm text-red-600 font-medium mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Alert Level
                  </div>
                  <div className="text-2xl font-bold text-red-900">
                    {currentVariation?.productMetaData.quantityAlert}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Tax Type</div>
                  <div className="font-semibold text-slate-800">
                    {currentVariation?.productMetaData.taxType}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">SKU</div>
                  <div className="font-semibold text-slate-800">
                    {currentVariation?.productMetaData.sku}
                  </div>
                </div>
              </div>
            </div>

            {/* Variations Comparison Table - Full Width */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                All Variations Comparison
              </h3>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Variations
                        <div className="flex gap-2 mt-2">
                          {Array.from(
                            new Set(
                              product?.productVariation?.flatMap((variation) =>
                                variation.variationOptions.map(
                                  (v) => v.attribute
                                )
                              )
                            )
                          ).map((attr, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium"
                            >
                              {attr}
                            </span>
                          ))}
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        SKU
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Price
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Discount
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Final Price
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Stock
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Tax
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Alert Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product?.productVariation?.map((variation, idx) => {
                      const { price, discountType, discountValue } =
                        variation.productMetaData;

                      let finalPrice = price;

                      if (discountType === "FIXED") {
                        finalPrice = price - discountValue;
                      } else if (discountType === "PERCENTAGE") {
                        finalPrice = price - (price * discountValue) / 100;
                      }
                      const stockStatus =
                        variation.productMetaData.quantity <=
                        variation.productMetaData.quantityAlert;

                      return (
                        <tr
                          key={idx}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            selectedVariation === idx
                              ? "bg-blue-100 border-blue-300"
                              : ""
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex gap-2 flex-wrap">
                              {variation.variationOptions.map((opt) => (
                                <span
                                  key={opt.attribute}
                                  className="px-2 py-1 text-xs rounded-md bg-gray-200    font-medium whitespace-nowrap"
                                >
                                  {opt.attributeValue}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
                              {variation.productMetaData.sku}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                              ₹{variation.productMetaData.price}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {variation.productMetaData.discountType ===
                            "NONE" ? (
                              <span className="text-sm text-slate-400">
                                None
                              </span>
                            ) : variation.productMetaData.discountType ===
                              "FIXED" ? (
                              <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                                -₹{variation.productMetaData.discountValue}
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                                -{variation.productMetaData.discountValue}%
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                              ₹{finalPrice}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                                stockStatus
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {variation.productMetaData.quantity}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full whitespace-nowrap font-medium">
                              {variation.productMetaData.taxType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-sm text-slate-600 whitespace-nowrap">
                              {variation.productMetaData.quantityAlert}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
