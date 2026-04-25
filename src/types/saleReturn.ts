// ----------------------------
// Sale Return
// ----------------------------
export interface SaleReturn {
  sale_return_id: string;
  srn_no: string;
  sale_return_date: string;
  status: "PENDING" | "RECEIVED";
  payment_status: "PAID" | "UNPAID" | "PARTIALLY_PAID";
  total_amount: number;

  summary: Summary;

  sale: Sale;

  customer: Customer;

  return_items: ReturnItem[];
}

// ----------------------------
// Summary
// ----------------------------
export interface Summary {
  total_items_count: number;
  fully_returned_count: number;
  total_return_qty: number;
  total_tax_amount: number;
  total_discount: number;
  net_return_amount: number;
}

// ----------------------------
// Sale Info
// ----------------------------
export interface Sale {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  payment_status: "PAID" | "UNPAID" | "PARTIALLY_PAID";
  order_tax: number;
  shipping: number;
  discount: number;
}

// ----------------------------
// Customer Info
// ----------------------------
export interface Customer {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

// ----------------------------
// Return Items
// ----------------------------
export interface ReturnItem {
  sale_return_item_id: string;
  sale_item_id: string;
  product_variant_id: string;
  warehouse_id: string;
  product_id: string;
  product_name: string;
  sku_code: string;
  variant_label: string;
  product_variant_name: string;
  unit_price: number;
  original_sold_qty: number;
  return_quantity: number;
  remaining_qty: number;
  is_fully_returned: boolean;
  discount: number;
  tax: number;
  tax_amount: number;
  net_amount: number;
  sub_total: number;
}

// ----------------------------
// Sale Return Response
// ----------------------------
export interface SaleReturnResponse {
  data: SaleReturn[];
}
