
export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  cost_price: number;
  quantity_in_stock: number;
  min_stock_level: number;
  barcode?: string;
  image_url?: string;
  sku?: string;
  unit: string;
  brand?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  user_id: string;
  product_id: string;
  transaction_type: 'sale' | 'purchase' | 'adjustment' | 'return';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  bill_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items: BillItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  bill_date: string;
  qr_code_token?: string;
  qr_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BillItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}
