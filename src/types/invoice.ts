
export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface VendorInfo {
  name: string;
  phone: string;
  address?: string;
  email?: string;
  gst?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  date: string;
  vendor: VendorInfo;
  customer: CustomerInfo;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes?: string;
}
