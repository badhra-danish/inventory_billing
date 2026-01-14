// import React from "react";

// function Invoives() {
//   return <div>Invoives</div>;
// }

// export default Invoives;

import { Button } from "@/components/ui/button";
import { useState } from "react";
// import pdfImg from "../../assets/images/pdf.jpg";
// import xslImg from "../../assets/images/xls.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
type Product = {
  code: string;
  name: string;
  price: number;
};

type ProductRow = {
  id: number;
  code: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
  taxAmount: number;
  totalCost: number;
};

const products: Product[] = [
  { code: "P001", name: "Plywood Sheet", price: 120 },
  { code: "P002", name: "Fevicol 5L", price: 80 },
  { code: "P003", name: "Sunmica Laminate", price: 150 },
  { code: "P004", name: "Nail Box", price: 40 },
];

export default function AddPurchase() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [rows, setRows] = useState<ProductRow[]>([]);

  const handleCancel = () => {
    navigate("/purchase");
  };
  // Search logic
  const handleSearch = (value: string) => {
    setQuery(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    const match = products.filter((p) =>
      p.code.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(match);
  };

  // Add row to table
  const addProductToTable = (product: Product) => {
    const newRow: ProductRow = {
      id: Date.now(),
      code: product.code,
      name: product.name,
      qty: 1,
      price: product.price,
      discount: 0,
      tax: 0,
      taxAmount: 0,
      totalCost: product.price,
    };

    setRows((prev) => [...prev, newRow]);

    // Clear search UI
    setQuery("");
    setFiltered([]);
  };

  const updateRow = (id: number, field: string, value: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              taxAmount: (row.price * row.qty * row.tax) / 100,
              totalCost:
                row.price * row.qty -
                (row.discount || 0) +
                (row.price * row.qty * row.tax) / 100,
            }
          : row
      )
    );
  };
  const removeRows = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  console.log(rows);

  return (
    <>
      {" "}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Add Purchase </p>
          <p>Add Your Purchase Order</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-blue-600 hover:bg-blue-500 hover:text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="mt-10 grid gap-6 bg-white p-4 rounded-md">
        <div className="flex justify-center gap-3 items-center ">
          <div className="w-full grid gap-3">
            <Label>Supplier Name</Label>

            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select The Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jhone">Jhone</SelectItem>
                <SelectItem value="Alice">Alice</SelectItem>
                <SelectItem value="Harry">Harry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full grid gap-3">
            <Label>Date</Label>
            <Input type="date" />
          </div>
          <div className="w-full grid gap-3">
            <Label>Refrence</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select The Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jhone">Jhone</SelectItem>
                <SelectItem value="Alice">Alice</SelectItem>
                <SelectItem value="Harry">Harry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 relative">
          <Label>Product</Label>
          <Input
            type="text"
            placeholder="Search Product By Code..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {filtered.length > 0 && (
            <div className="absolute bg-white border w-full mt-1 shadow-md z-10 rounded-md">
              {filtered.map((p) => (
                <div
                  key={p.code}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addProductToTable(p)}
                >
                  {p.code} — {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* table */}
        <div>
          <table className="w-full mt-4 text-sm border rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <tr>
                <th className="p-3 text-left font-semibold">Product</th>
                <th className="p-3 text-center font-semibold">Qty</th>
                <th className="p-3 text-center font-semibold">Price</th>
                <th className="p-3 text-center font-semibold">Discount</th>
                <th className="p-3 text-center font-semibold">Tax %</th>
                <th className="p-3 text-center font-semibold">Tax Amt</th>
                <th className="p-3 text-center font-semibold">Total</th>
                <th className="p-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-neutral-900">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  {/* Product Name */}
                  <td className="p-3 font-medium text-neutral-800 dark:text-neutral-200">
                    {row.name}
                  </td>

                  {/* Qty */}
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-neutral-800 dark:border-neutral-700"
                      value={row.qty}
                      onChange={(e) =>
                        updateRow(row.id, "qty", Number(e.target.value))
                      }
                    />
                  </td>

                  {/* Price */}
                  <td className="p-3 text-center font-semibold">
                    ${row.price}
                  </td>

                  {/* Discount */}
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-neutral-800 dark:border-neutral-700"
                      value={row.discount}
                      onChange={(e) =>
                        updateRow(row.id, "discount", Number(e.target.value))
                      }
                    />
                  </td>

                  {/* Tax % */}
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-neutral-800 dark:border-neutral-700"
                      value={row.tax}
                      onChange={(e) =>
                        updateRow(row.id, "tax", Number(e.target.value))
                      }
                    />
                  </td>

                  {/* Tax Amount */}
                  <td className="p-3 text-center font-medium">
                    ${row.taxAmount.toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="p-3 text-center font-bold text-green-600 dark:text-green-400">
                    ${row.totalCost.toFixed(2)}
                  </td>

                  {/* Delete */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeRows(row.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 "
                    >
                      <X className="w-4 h-4 " />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* checkout-info */}

        <div className="flex items-center justify-end">
          <div className="w-110 rounded-lg border shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border  bg-gray-50">
                    Order Tax
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">$ 0.00</td>
                </tr>

                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                    Discount
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">$ 0.00</td>
                </tr>

                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                    Shipping
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">$ 0.00</td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-bold text-neutral-800 dark:text-neutral-100 border bg-gray-50">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-neutral-50 border">
                    $ 0.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* tax-info */}
        <div className="flex gap-2 justify-center items-center">
          <div className="grid gap-4 w-full">
            <Label>Order Tax</Label>
            <Input type="number" defaultValue={0} />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Discount</Label>
            <Input type="number" defaultValue={0} />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Shipping</Label>
            <Input type="number" defaultValue={0} />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Status</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4">
          <Label>Description</Label>
          <Textarea placeholder="Enter Descriptions..." />
        </div>
        <div className="border-t-1 mt-5">
          <div className="flex gap-3 items-center justify-end mt-5">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
}
