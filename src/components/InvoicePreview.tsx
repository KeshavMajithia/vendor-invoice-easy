
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from '@/types/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onSave: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onBack, onSave }) => {
  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
            .invoice-title { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .invoice-number { font-size: 18px; color: #666; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .vendor, .customer { flex: 1; }
            .customer { text-align: right; }
            .party-title { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .party-info { font-size: 14px; line-height: 1.8; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background-color: #2563eb; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .items-table tr:nth-child(even) { background-color: #f9f9f9; }
            .totals { text-align: right; margin-bottom: 30px; }
            .totals-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
            .totals-label { width: 200px; text-align: right; padding-right: 20px; }
            .totals-value { width: 120px; text-align: right; font-weight: bold; }
            .final-total { border-top: 2px solid #2563eb; padding-top: 10px; font-size: 18px; color: #16a34a; }
            .notes { margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
            .notes-title { font-weight: bold; margin-bottom: 10px; color: #2563eb; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            @media print { 
              body { -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">${invoice.invoiceNumber}</div>
              <div style="margin-top: 10px; color: #666;">Date: ${new Date(invoice.date).toLocaleDateString()}</div>
            </div>

            <div class="parties">
              <div class="vendor">
                <div class="party-title">FROM</div>
                <div class="party-info">
                  <strong>${invoice.vendor.name}</strong><br>
                  ${invoice.vendor.phone}<br>
                  ${invoice.vendor.address ? invoice.vendor.address + '<br>' : ''}
                  ${invoice.vendor.gst ? 'GST: ' + invoice.vendor.gst : ''}
                </div>
              </div>
              <div class="customer">
                <div class="party-title">TO</div>
                <div class="party-info">
                  <strong>${invoice.customer.name}</strong><br>
                  ${invoice.customer.phone}<br>
                  ${invoice.customer.address || ''}
                </div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                    <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row">
                <div class="totals-label">Subtotal:</div>
                <div class="totals-value">₹${invoice.subtotal.toFixed(2)}</div>
              </div>
              ${invoice.discountAmount > 0 ? `
                <div class="totals-row" style="color: #dc2626;">
                  <div class="totals-label">Discount (${invoice.discountRate}%):</div>
                  <div class="totals-value">-₹${invoice.discountAmount.toFixed(2)}</div>
                </div>
              ` : ''}
              ${invoice.taxAmount > 0 ? `
                <div class="totals-row" style="color: #2563eb;">
                  <div class="totals-label">Tax (${invoice.taxRate}%):</div>
                  <div class="totals-value">₹${invoice.taxAmount.toFixed(2)}</div>
                </div>
              ` : ''}
              <div class="totals-row final-total">
                <div class="totals-label">Total:</div>
                <div class="totals-value">₹${invoice.total.toFixed(2)}</div>
              </div>
            </div>

            ${invoice.notes ? `
              <div class="notes">
                <div class="notes-title">Notes:</div>
                <div>${invoice.notes}</div>
              </div>
            ` : ''}

            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>Made with ❤️ by Invoice Generator</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
          <div className="space-x-4">
            <Button onClick={generatePDF} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
              Save Invoice
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-lg max-w-4xl mx-auto">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="text-center mb-8 pb-6 border-b-4 border-blue-600">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h1>
              <p className="text-xl text-gray-600">{invoice.invoiceNumber}</p>
              <p className="text-gray-600 mt-2">Date: {new Date(invoice.date).toLocaleDateString()}</p>
            </div>

            {/* Vendor and Customer Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-4">FROM</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{invoice.vendor.name}</p>
                  <p className="text-gray-600">{invoice.vendor.phone}</p>
                  {invoice.vendor.address && <p className="text-gray-600">{invoice.vendor.address}</p>}
                  {invoice.vendor.gst && <p className="text-gray-600">GST: {invoice.vendor.gst}</p>}
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-blue-600 mb-4">TO</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{invoice.customer.name}</p>
                  <p className="text-gray-600">{invoice.customer.phone}</p>
                  {invoice.customer.address && <p className="text-gray-600">{invoice.customer.address}</p>}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-left p-4 rounded-tl-lg">Item</th>
                    <th className="text-center p-4">Qty</th>
                    <th className="text-right p-4">Price</th>
                    <th className="text-right p-4 rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 border-b">{item.name}</td>
                      <td className="p-4 border-b text-center">{item.quantity}</td>
                      <td className="p-4 border-b text-right">₹{item.price.toFixed(2)}</td>
                      <td className="p-4 border-b text-right font-semibold">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-red-600">
                    <span>Discount ({invoice.discountRate}%):</span>
                    <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between py-2 text-blue-600">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span>₹{invoice.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-3 border-t-2 border-blue-600" />
                <div className="flex justify-between py-3 text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-blue-600 mb-2">Notes:</h4>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Generated on {new Date().toLocaleString()}</p>
              <p className="mt-1">Made with ❤️ by Invoice Generator</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePreview;
