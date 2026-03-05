import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";

interface Warehouse {
  warehouse_id: string;
  warehouseName: string;
}

interface RowType {
  variant_id: string;
  warehouse_id?: string | null;
}

interface WarehouseSearchProps {
  warehouses: Warehouse[];
  row: RowType;
  updateRow: (
    rowId: string,
    field: keyof RowType,
    value: number | string | null,
  ) => void;
}

const WarehouseSearch: React.FC<WarehouseSearchProps> = ({
  warehouses,
  row,
  updateRow,
}) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter warehouses
  const filteredWarehouses = warehouses.filter((w) =>
    w.warehouseName.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    if (row.warehouse_id) {
      const selectedWarehouse = warehouses.find(
        (w) => w.warehouse_id === row.warehouse_id,
      );

      if (selectedWarehouse) {
        setSearch(selectedWarehouse.warehouseName);
      }
    } else {
      setSearch("");
    }
  }, [row.warehouse_id, warehouses]);
  return (
    <div className="relative w-48" ref={dropdownRef}>
      <Input
        type="text"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search warehouse..."
        className="border rounded h-8 px-2 w-full"
      />

      {open && filteredWarehouses.length > 0 && (
        <div className="absolute z-50 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow-md">
          {filteredWarehouses.map((w) => (
            <div
              key={w.warehouse_id}
              onClick={() => {
                updateRow(row.variant_id, "warehouse_id", w.warehouse_id);
                setSearch(w.warehouseName);
                setOpen(false);
              }}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {w.warehouseName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarehouseSearch;
