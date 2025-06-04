
import { Invoice, LineItem } from '@/types/invoice';

// Transform database invoice to frontend Invoice type
export const transformDatabaseInvoice = (dbInvoice: any): Invoice => {
  return {
    id: dbInvoice.id,
    invoiceNumber: dbInvoice.invoice_number || '',
    date: dbInvoice.invoice_date || new Date().toISOString().split('T')[0],
    vendor: {
      name: 'My Business', // Default vendor name
      phone: '',
      address: '',
      email: '',
      gst: ''
    },
    customer: {
      id: dbInvoice.id,
      name: dbInvoice.client_name || '',
      email: dbInvoice.client_email || '',
      address: dbInvoice.client_address || '',
      phone: ''
    },
    items: Array.isArray(dbInvoice.items) ? dbInvoice.items as LineItem[] : [],
    subtotal: Number(dbInvoice.subtotal) || 0,
    taxRate: 0, // Default tax rate
    taxAmount: Number(dbInvoice.tax_amount) || 0,
    discountRate: 0, // Default discount rate
    discountAmount: 0, // Default discount amount
    total: Number(dbInvoice.total_amount) || 0,
    notes: 'Thank you for your business!',
    showUpiQr: false
  };
};

// Transform frontend Invoice to database format
export const transformInvoiceForDatabase = (invoice: Omit<Invoice, 'id'>, userId: string) => {
  return {
    user_id: userId,
    invoice_number: invoice.invoiceNumber,
    invoice_date: invoice.date,
    client_name: invoice.customer.name,
    client_email: invoice.customer.email || null,
    client_address: invoice.customer.address || null,
    items: JSON.parse(JSON.stringify(invoice.items)), // Ensure proper JSON serialization
    subtotal: invoice.subtotal,
    tax_amount: invoice.taxAmount,
    total_amount: invoice.total,
    status: 'draft'
  };
};
