// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowLeft, Printer } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";
// const ProductDetails = () => {
//   const navigate = useNavigate();
//   const { product_id } = useParams();
//   const productData = {
//     sku: product_id,
//     barcode: "86102192",
//     product: "Macbook pro",
//     category: "Computers",
//     subCategory: "None",
//     brand: "None",
//     unit: "Piece",
//     minimumQty: "5",
//     quantity: "50",
//     tax: "0.00 %",
//     discountType: "Percentage",
//     price: "1500.00",
//     status: "Active",
//     description:
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
//     image: "macbookpro.jpg",
//     imageSize: "581kb",
//   };

//   const detailRows = [
//     { label: "SKU", value: productData.sku },
//     { label: "Product", value: productData.product },
//     { label: "Category", value: productData.category },
//     { label: "Sub Category", value: productData.subCategory },
//     { label: "Brand", value: productData.brand },
//     { label: "Unit", value: productData.unit },
//     { label: "Minimum Qty", value: productData.minimumQty },
//     { label: "Quantity", value: productData.quantity },
//     { label: "Tax", value: productData.tax },
//     { label: "Discount Type", value: productData.discountType },
//     { label: "Price", value: productData.price },
//     { label: "Status", value: productData.status },
//     { label: "Description", value: productData.description },
//   ];

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-5">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-900">
//               Product Details
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Full details of a product
//             </p>
//           </div>
//           <div>
//             <Button onClick={() => navigate("/products")}>
//               <ArrowLeft />
//               Back To Product
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Section - Product Details */}
//           <div className="lg:col-span-2">
//             <Card className="shadow-sm rounded-sm">
//               <CardContent className="p-6">
//                 {/* Barcode Section */}
//                 <div className="border rounded-md p-4 mb-6 flex items-center justify-between bg-white">
//                   <div className="flex flex-col items-center">
//                     <svg className="w-48 h-16" viewBox="0 0 200 60">
//                       {/* Simple barcode representation */}
//                       {[
//                         0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
//                         0, 0, 1, 1, 0, 1, 0, 1,
//                       ].map((thick, i) => (
//                         <rect
//                           key={i}
//                           x={10 + i * 6}
//                           y={5}
//                           width={thick ? 4 : 2}
//                           height={40}
//                           fill="black"
//                         />
//                       ))}
//                     </svg>
//                     <span className="text-sm font-medium mt-2">
//                       {productData.barcode}
//                     </span>
//                   </div>
//                   <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
//                     <Printer className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>

//                 {/* Details Table */}
//                 <div className="border rounded-md overflow-hidden">
//                   <table className="w-full">
//                     <tbody>
//                       {detailRows.map((row, index) => (
//                         <tr key={index} className="border-b last:border-b-0">
//                           <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 w-1/3 border-r">
//                             {row.label}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {row.value}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Section - Product Image */}
//           <div className="lg:col-span-1">
//             <Card className="shadow- rounded-sm">
//               <CardContent className="p-6">
//                 <div className="relative bg-white rounded-lg border p-4">
//                   {/* Laptop Image */}
//                   <div className="flex flex-col items-center">
//                     <div className="relative w-full max-w-sm">
//                       <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-2 shadow-xl">
//                         <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-orange-200 rounded-md aspect-video overflow-hidden">
//                           <img
//                             src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
//                             alt="Mountain landscape"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="flex justify-center mt-2">
//                           <div className="w-16 h-3 bg-gray-700 rounded-full"></div>
//                         </div>
//                       </div>
//                       <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2 rounded-b-lg mx-4 shadow-md"></div>
//                     </div>

//                     {/* Image Info */}
//                     <div className="mt-4 text-center">
//                       <p className="text-sm font-medium text-gray-900">
//                         {productData.image}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {productData.imageSize}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
// import React, { useState } from "react";
// import {
//   Package,
//   Tag,
//   Calendar,
//   Shield,
//   Factory,
//   Box,
//   AlertCircle,
// } from "lucide-react";

// const ProductDetails = () => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedVariation, setSelectedVariation] = useState(0);

//   const product = {
//     productID: "b136df43-292e-4073-a2d5-90fc9186e148",
//     name: "MDF",
//     slug: "plywoodslug",
//     productType: "variable",
//     sellingType: "WHOLESALE",
//     description: "sdfwefwerw",
//     brandName: "Greenply",
//     categoryName: "PLY",
//     subCategoryName: "Play",
//     unitName: "Sheets",
//     warranty: "2-year",
//     manufacturer: "Starlix",
//     manufacturedDate: "2025-12-01",
//     expiryDate: "2025-12-31",
//     createAt: "2025-12-04",
//     imageUrl: [
//       "https://res.cloudinary.com/dzbts0k5s/image/upload/v1764827894/product_img/Aizen_f1cd9cad-7cc9-4362-a05a-02afdc36ddd3.jpg",
//       "https://res.cloudinary.com/dzbts0k5s/image/upload/v1764827897/product_img/salman_63b4237a-f3be-4ad0-a3e2-cd246f89a393.png",
//     ],
//     productVariations: [
//       {
//         productVariationID: "cb86c79d-bea2-4ede-b6e5-273142c649b9",
//         productMetaData: {
//           sku: "sdfs",
//           price: 324,
//           quantity: 234,
//           taxType: "EXCLUSIVE",
//           taxValue: 0,
//           discountType: "FIXED",
//           discountValue: 342,
//           quantityAlert: 33,
//         },
//         variationOptions: [
//           {
//             attribute: "Color",
//             attributeValue: "green",
//             variationOptionID: "f7524393-b5f9-4658-a1d3-b82f04a8b858",
//           },
//           {
//             attribute: "Size",
//             attributeValue: "M",
//             variationOptionID: "36500f1b-9bbf-49be-8f56-df6bd7ea48a8",
//           },
//         ],
//       },
//       {
//         productVariationID: "fd9a8f5a-10a5-4aac-88fd-4f7729fa66cd",
//         productMetaData: {
//           sku: "frh",
//           price: 234,
//           quantity: 534,
//           taxType: "INCLUSIVE",
//           taxValue: 0,
//           discountType: "NONE",
//           discountValue: 122,
//           quantityAlert: 45,
//         },
//         variationOptions: [
//           {
//             attribute: "Color",
//             attributeValue: "Red",
//             variationOptionID: "90e11b44-1588-4e59-9958-d06fabe43db0",
//           },
//           {
//             attribute: "Size",
//             attributeValue: "M",
//             variationOptionID: "89275f45-81e3-42b8-bf92-1e7441a13cb8",
//           },
//         ],
//       },
//     ],
//   };

//   const currentVariation = product.productVariations[selectedVariation];
//   const finalPrice =
//     currentVariation.productMetaData.discountType === "FIXED"
//       ? currentVariation.productMetaData.price -
//         currentVariation.productMetaData.discountValue
//       : currentVariation.productMetaData.price;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-slate-800 mb-2">
//                 {product.name}
//               </h1>
//               <p className="text-slate-500 text-sm mb-3">
//                 Product ID: {product.productID}
//               </p>
//               <div className="flex gap-2 flex-wrap">
//                 <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                   {product.productType}
//                 </span>
//                 <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
//                   {product.sellingType}
//                 </span>
//                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//                   {product.brandName}
//                 </span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-green-600">
//                 ₹{finalPrice}
//               </div>
//               {currentVariation.productMetaData.discountType === "FIXED" && (
//                 <div className="text-slate-400 line-through text-lg">
//                   ₹{currentVariation.productMetaData.price}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Images Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-lg font-semibold text-slate-800 mb-4">
//                 Product Images
//               </h3>
//               <div className="mb-4 bg-slate-100 rounded-lg overflow-hidden aspect-square">
//                 <img
//                   src={product.imageUrl[selectedImage]}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 {product.imageUrl.map((url, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImage(idx)}
//                     className={`flex-1 border-2 rounded-lg overflow-hidden aspect-square ${
//                       selectedImage === idx
//                         ? "border-blue-500"
//                         : "border-slate-200"
//                     }`}
//                   >
//                     <img
//                       src={url}
//                       alt={`Thumb ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Info */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-blue-600" />
//                 Product Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Tag className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Category</div>
//                     <div className="font-medium text-slate-800">
//                       {product.categoryName} / {product.subCategoryName}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Factory className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Manufacturer</div>
//                     <div className="font-medium text-slate-800">
//                       {product.manufacturer}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Shield className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Warranty</div>
//                     <div className="font-medium text-slate-800">
//                       {product.warranty}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Box className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Unit</div>
//                     <div className="font-medium text-slate-800">
//                       {product.unitName}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Calendar className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Manufactured</div>
//                     <div className="font-medium text-slate-800">
//                       {product.manufacturedDate}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                   <Calendar className="w-5 h-5 text-slate-600" />
//                   <div>
//                     <div className="text-xs text-slate-500">Expiry</div>
//                     <div className="font-medium text-slate-800">
//                       {product.expiryDate}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Variations Selector */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-slate-800 mb-4">
//                 Select Variation
//               </h3>
//               <div className="flex gap-3">
//                 {product.productVariations.map((variation, idx) => {
//                   const options = variation.variationOptions
//                     .map((v) => `${v.attributeValue}`)
//                     .join(" / ");
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => setSelectedVariation(idx)}
//                       className={`flex-1 p-4 rounded-lg border-2 transition-all ${
//                         selectedVariation === idx
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-slate-200 hover:border-slate-300"
//                       }`}
//                     >
//                       <div className="font-semibold text-slate-800">
//                         {options}
//                       </div>
//                       <div className="text-sm text-slate-500 mt-1">
//                         SKU: {variation.productMetaData.sku}
//                       </div>
//                       <div className="text-lg font-bold text-green-600 mt-2">
//                         ₹{variation.productMetaData.price}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Current Variation Details */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-slate-800 mb-4">
//                 Variation Details
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
//                   <div className="text-sm text-blue-600 font-medium mb-1">
//                     Price
//                   </div>
//                   <div className="text-2xl font-bold text-blue-900">
//                     ₹{currentVariation.productMetaData.price}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
//                   <div className="text-sm text-green-600 font-medium mb-1">
//                     In Stock
//                   </div>
//                   <div className="text-2xl font-bold text-green-900">
//                     {currentVariation.productMetaData.quantity}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
//                   <div className="text-sm text-orange-600 font-medium mb-1">
//                     Discount
//                   </div>
//                   <div className="text-2xl font-bold text-orange-900">
//                     {currentVariation.productMetaData.discountType === "FIXED"
//                       ? `₹${currentVariation.productMetaData.discountValue}`
//                       : "None"}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
//                   <div className="text-sm text-red-600 font-medium mb-1 flex items-center gap-1">
//                     <AlertCircle className="w-3 h-3" />
//                     Alert Level
//                   </div>
//                   <div className="text-2xl font-bold text-red-900">
//                     {currentVariation.productMetaData.quantityAlert}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 grid grid-cols-2 gap-4">
//                 <div className="p-3 bg-slate-50 rounded-lg">
//                   <div className="text-xs text-slate-500 mb-1">Tax Type</div>
//                   <div className="font-semibold text-slate-800">
//                     {currentVariation.productMetaData.taxType}
//                   </div>
//                 </div>
//                 <div className="p-3 bg-slate-50 rounded-lg">
//                   <div className="text-xs text-slate-500 mb-1">SKU</div>
//                   <div className="font-semibold text-slate-800">
//                     {currentVariation.productMetaData.sku}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Variations Comparison Table */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-slate-800 mb-4">
//                 All Variations Comparison
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-2 border-slate-200">
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
//                         Variation
//                       </th>
//                       <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
//                         SKU
//                       </th>
//                       <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
//                         Price
//                       </th>
//                       <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
//                         Discount
//                       </th>
//                       <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
//                         Final Price
//                       </th>
//                       <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
//                         Stock
//                       </th>
//                       <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
//                         Tax
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {product.productVariations.map((variation, idx) => {
//                       const options = variation.variationOptions
//                         .map((v) => `${v.attribute}: ${v.attributeValue}`)
//                         .join(", ");
//                       const finalPrice =
//                         variation.productMetaData.discountType === "FIXED"
//                           ? variation.productMetaData.price -
//                             variation.productMetaData.discountValue
//                           : variation.productMetaData.price;
//                       const stockStatus =
//                         variation.productMetaData.quantity <=
//                         variation.productMetaData.quantityAlert;

//                       return (
//                         <tr
//                           key={idx}
//                           className={`border-b border-slate-100 hover:bg-slate-50 ${
//                             selectedVariation === idx ? "bg-blue-50" : ""
//                           }`}
//                         >
//                           <td className="py-3 px-4">
//                             <div className="text-sm font-medium text-slate-800">
//                               {options}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className="text-sm text-slate-600 font-mono">
//                               {variation.productMetaData.sku}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-semibold text-slate-800">
//                               ₹{variation.productMetaData.price}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             {variation.productMetaData.discountType ===
//                             "FIXED" ? (
//                               <span className="text-sm font-semibold text-orange-600">
//                                 -₹{variation.productMetaData.discountValue}
//                               </span>
//                             ) : (
//                               <span className="text-sm text-slate-400">
//                                 None
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span className="text-sm font-bold text-green-600">
//                               ₹{finalPrice}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             <span
//                               className={`text-sm font-semibold ${
//                                 stockStatus ? "text-red-600" : "text-green-600"
//                               }`}
//                             >
//                               {variation.productMetaData.quantity}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
//                               {variation.productMetaData.taxType}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Calendar,
  Shield,
  Factory,
  Box,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProductById } from "@/api/CreateProduct/ProductClinet";
import { useParams } from "react-router-dom";
export interface Product {
  productID: string;
  productType: "simple" | "variable";
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
  imageUrl: string[];
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

// 🔥 Reusable union types
export type TaxType = "NONE" | "EXCLUSIVE" | "INCLUSIVE";
export type DiscountType = "NONE" | "FIXED" | "PERCENTAGE";

const ProductDetails = () => {
  const productID = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
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
  // Auto-slide images every 3 seconds
  useEffect(() => {
    getProduct(); // fetch product

    // Only start interval once product is loaded
  }, []);

  // Separate effect to handle auto-slide after product is loaded
  useEffect(() => {
    if (!product?.imageUrl || product.imageUrl.length === 0) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.imageUrl.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [product]);

  // const product = {
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

  const nextImage = () => {
    setSelectedImage((prev) =>
      product?.imageUrl && product.imageUrl.length > 0
        ? (prev + 1) % product.imageUrl.length
        : 0
    );
  };

  const prevImage = () => {
    const total = product?.imageUrl?.length ?? 0;
    if (total === 0) return;
    setSelectedImage((prev) => (prev - 1 + total) % total);
  };

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
            <div className="bg-white rounded-xl shadow-lg p-6 w-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Product Images
              </h3>
              <div className="mb-4 bg-slate-100 rounded-lg overflow-hidden aspect-square relative group">
                <img
                  src={product?.imageUrl[selectedImage]}
                  alt={product?.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {product?.imageUrl.length}
                </div>
              </div>
              {/* <div className="flex gap-2">
                {product.imageUrl.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 border-2 rounded-lg overflow-hidden aspect-square transition-all hover:scale-105 ${
                      selectedImage === idx
                        ? "border-blue-500 scale-105"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div> */}
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {product?.imageUrl.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === idx ? "bg-blue-500 w-6" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

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
