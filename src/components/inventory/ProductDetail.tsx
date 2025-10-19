import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const productData = {
    sku: product_id,
    barcode: "86102192",
    product: "Macbook pro",
    category: "Computers",
    subCategory: "None",
    brand: "None",
    unit: "Piece",
    minimumQty: "5",
    quantity: "50",
    tax: "0.00 %",
    discountType: "Percentage",
    price: "1500.00",
    status: "Active",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    image: "macbookpro.jpg",
    imageSize: "581kb",
  };

  const detailRows = [
    { label: "SKU", value: productData.sku },
    { label: "Product", value: productData.product },
    { label: "Category", value: productData.category },
    { label: "Sub Category", value: productData.subCategory },
    { label: "Brand", value: productData.brand },
    { label: "Unit", value: productData.unit },
    { label: "Minimum Qty", value: productData.minimumQty },
    { label: "Quantity", value: productData.quantity },
    { label: "Tax", value: productData.tax },
    { label: "Discount Type", value: productData.discountType },
    { label: "Price", value: productData.price },
    { label: "Status", value: productData.status },
    { label: "Description", value: productData.description },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Product Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Full details of a product
            </p>
          </div>
          <div>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft />
              Back To Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Product Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm rounded-sm">
              <CardContent className="p-6">
                {/* Barcode Section */}
                <div className="border rounded-md p-4 mb-6 flex items-center justify-between bg-white">
                  <div className="flex flex-col items-center">
                    <svg className="w-48 h-16" viewBox="0 0 200 60">
                      {/* Simple barcode representation */}
                      {[
                        0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
                        0, 0, 1, 1, 0, 1, 0, 1,
                      ].map((thick, i) => (
                        <rect
                          key={i}
                          x={10 + i * 6}
                          y={5}
                          width={thick ? 4 : 2}
                          height={40}
                          fill="black"
                        />
                      ))}
                    </svg>
                    <span className="text-sm font-medium mt-2">
                      {productData.barcode}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Details Table */}
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {detailRows.map((row, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 w-1/3 border-r">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Product Image */}
          <div className="lg:col-span-1">
            <Card className="shadow- rounded-sm">
              <CardContent className="p-6">
                <div className="relative bg-white rounded-lg border p-4">
                  {/* Laptop Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-sm">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-2 shadow-xl">
                        <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-orange-200 rounded-md aspect-video overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                            alt="Mountain landscape"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex justify-center mt-2">
                          <div className="w-16 h-3 bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-2 rounded-b-lg mx-4 shadow-md"></div>
                    </div>

                    {/* Image Info */}
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {productData.image}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {productData.imageSize}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
