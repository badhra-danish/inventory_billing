import React from "react";
import { Button } from "@/components/ui/button";
import Products from "@/components/inventory/ProductDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";

function ProductDataTablepage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Product List</p>
          <p>Manage Your Products</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={pdfImg} className="w-5 h-6" />
          </Button>
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={xslImg} className="w-5 h-6" />
          </Button>
          <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button>
        </div>
      </div>
      <Products />
    </>
  );
}

export default ProductDataTablepage;
