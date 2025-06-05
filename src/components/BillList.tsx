
import React from 'react';
import { Bill } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Share, Receipt } from 'lucide-react';

interface BillListProps {
  bills: Bill[];
  onDelete: (billId: string) => void;
}

const BillList = ({ bills, onDelete }: BillListProps) => {
  const handlePrint = (bill: Bill) => {
    // Create a printable version of the bill
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <html>
        <head>
          <title>Bill ${bill.bill_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .bill-details { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BILL</h1>
            <h2>Bill Number: ${bill.bill_number}</h2>
          </div>
          
          <div class="bill-details">
            <p><strong>Date:</strong> ${new Date(bill.bill_date).toLocaleDateString()}</p>
            ${bill.customer_name ? `<p><strong>Customer:</strong> ${bill.customer_name}</p>` : ''}
            ${bill.customer_phone ? `<p><strong>Phone:</strong> ${bill.customer_phone}</p>` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Subtotal: ₹${bill.subtotal.toFixed(2)}</strong></p>
            ${bill.tax_amount > 0 ? `<p><strong>Tax: ₹${bill.tax_amount.toFixed(2)}</strong></p>` : ''}
            ${bill.discount_amount > 0 ? `<p><strong>Discount: -₹${bill.discount_amount.toFixed(2)}</strong></p>` : ''}
            <p style="font-size: 18px;"><strong>Total: ₹${bill.total_amount.toFixed(2)}</strong></p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = (bill: Bill) => {
    if (bill.qr_code_token) {
      const shareUrl = `${window.location.origin}?token=${bill.qr_code_token}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
      });
    }
  };

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bills Found</h3>
          <p className="text-gray-500">Start by creating your first bill.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Bills</h2>
      
      <div className="grid gap-4">
        {bills.map((bill) => (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bill.bill_number}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {new Date(bill.bill_date).toLocaleDateString()} • {bill.payment_method}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={bill.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {bill.payment_status}
                  </Badge>
                  <div className="text-right">
                    <p className="font-semibold">₹{bill.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bill.customer_name && (
                  <div>
                    <p className="text-sm text-gray-600">Customer: {bill.customer_name}</p>
                    {bill.customer_phone && (
                      <p className="text-sm text-gray-600">Phone: {bill.customer_phone}</p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Items ({bill.items.length}):</p>
                  <div className="space-y-1">
                    {bill.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span>₹{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                    {bill.items.length > 3 && (
                      <p className="text-sm text-gray-500">+{bill.items.length - 3} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(bill)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    {bill.qr_code_token && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(bill)}
                      >
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(bill.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BillList;
