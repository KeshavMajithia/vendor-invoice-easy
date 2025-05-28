
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
  logo?: string;
  upiId?: string;
  customFooter?: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  lastUsed?: string;
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
  showUpiQr?: boolean;
}

export interface BusinessProfile {
  name: string;
  phone: string;
  address?: string;
  email?: string;
  gst?: string;
  logo?: string;
  upiId?: string;
  customFooter?: string;
}

export interface Analytics {
  totalRevenue: number;
  monthlyRevenue: number;
  topCustomers: { name: string; total: number; count: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  totalInvoices: number;
  monthlyInvoices: number;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplate {
  id: string;
  user_id: string;
  name: string;
  template_data: any;
  created_at: string;
  updated_at: string;
}

export interface SharedInvoice {
  id: string;
  invoice_id: string;
  share_token: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}
