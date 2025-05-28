
import React, { useState } from 'react';
import { ArrowLeft, FileText, X, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from '@/types/invoice';
import InvoicePreview from './InvoicePreview';

interface SavedInvoicesProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onBack: () => void;
}

const SavedInvoices: React.FC<SavedInvoicesProps> = ({ invoices, onDelete, onBack }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  if (selectedInvoice) {
    return (
      <InvoicePreview 
        invoice={selectedInvoice} 
        onBack={() => setSelectedInvoice(null)}
        onSave={() => setSelectedInvoice(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Saved Invoices</h1>
          <p className="text-gray-600 mt-2">Manage your previously created invoices</p>
        </div>

        {invoices.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Invoices Yet</h3>
              <p className="text-gray-500 mb-6">You haven't created any invoices yet. Start by creating your first invoice!</p>
              <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
                Create First Invoice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-800 mb-1">
                        {invoice.invoiceNumber}
                      </CardTitle>
                      <p className="text-gray-600">
                        {new Date(invoice.date).toLocaleDateString()} • {invoice.customer.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{invoice.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                      <p className="text-gray-600">{invoice.customer.name}</p>
                      <p className="text-gray-600">{invoice.customer.phone}</p>
                      {invoice.customer.address && (
                        <p className="text-gray-600 text-sm">{invoice.customer.address}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Invoice Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>₹{invoice.subtotal.toFixed(2)}</span>
                        </div>
                        {invoice.taxAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span>₹{invoice.taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {invoice.discountAmount > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Discount:</span>
                            <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInvoice(invoice)}
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => invoice.id && onDelete(invoice.id)}
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {invoices.length > 0 && (
          <div className="mt-8 text-center">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg inline-block">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Total Statistics</h3>
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
                    <div className="text-sm text-gray-600">Total Invoices</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {invoices.reduce((sum, inv) => sum + inv.items.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedInvoices;
