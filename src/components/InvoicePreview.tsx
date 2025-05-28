
import React, { useRef } from 'react';
import { ArrowLeft, Download, Share2, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from '@/types/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onSave: () => void;
  isSharedView?: boolean;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  invoice, 
  onBack, 
  onSave, 
  isSharedView = false 
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 20px; }
                .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .party { width: 45%; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-row { font-weight: bold; }
                .notes { margin-top: 20px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Invoice ${invoice.invoiceNumber}\nAmount: ₹${invoice.total.toLocaleString()}\nCustomer: ${invoice.customer.name}\n\nThank you for your business!`;
    const whatsappUrl = `https://wa.me/${invoice.customer.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {!isSharedView && (
            <div className="flex space-x-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Print/PDF
              </Button>
              {invoice.customer.phone && (
                <Button
                  onClick={handleWhatsAppShare}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
              )}
              <Button
                onClick={onSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Invoice
              </Button>
            </div>
          )}
        </div>

        <Card className="bg-white shadow-2xl max-w-4xl mx-auto">
          <CardContent className="p-0">
            <div ref={printRef} className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Invoice Details</h3>
                  <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                {invoice.vendor.gst && (
                  <div className="text-right">
                    <p><strong>GST Number:</strong> {invoice.vendor.gst}</p>
                  </div>
                )}
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">From</h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{invoice.vendor.name}</p>
                    {invoice.vendor.phone && <p>📞 {invoice.vendor.phone}</p>}
                    {invoice.vendor.email && <p>✉️ {invoice.vendor.email}</p>}
                    {invoice.vendor.address && (
                      <p className="text-gray-600">{invoice.vendor.address}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">To</h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{invoice.customer.name}</p>
                    {invoice.customer.phone && <p>📞 {invoice.customer.phone}</p>}
                    {invoice.customer.email && <p>✉️ {invoice.customer.email}</p>}
                    {invoice.customer.address && (
                      <p className="text-gray-600">{invoice.customer.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left">#</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Quantity</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Rate (₹)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">₹{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-1/2">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>₹{invoice.subtotal.toFixed(2)}</span>
                    </div>
                    {invoice.discountAmount > 0 && (
                      <div className="flex justify-between py-2 text-red-600">
                        <span>Discount ({invoice.discountRate}%):</span>
                        <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxAmount > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Tax ({invoice.taxRate}%):</span>
                        <span>₹{invoice.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 text-xl font-bold border-t border-gray-300">
                      <span>Total:</span>
                      <span className="text-green-600">₹{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI QR Code */}
              {invoice.showUpiQr && invoice.vendor.upiId && (
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold mb-4">Pay using UPI</h3>
                  <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                      QR Code
                    </div>
                    <p className="mt-2 text-sm">UPI ID: {invoice.vendor.upiId}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {invoice.notes && (
                <div className="border-t border-gray-300 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-300">
                <p className="text-gray-500 text-sm">
                  This is a computer-generated invoice and does not require a signature.
                </p>
                {invoice.vendor.customFooter && (
                  <p className="text-gray-600 mt-2">{invoice.vendor.customFooter}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePreview;
