
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Invoice, LineItem, VendorInfo, CustomerInfo } from '@/types/invoice';
import InvoicePreview from './InvoicePreview';

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onBack: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, onBack }) => {
  const [vendor, setVendor] = useState<VendorInfo>({ name: '', phone: '' });
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '' });
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', name: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(18);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business!');
  const [showPreview, setShowPreview] = useState(false);

  // Load vendor info from localStorage on component mount
  useEffect(() => {
    const savedVendor = localStorage.getItem('vendorInfo');
    if (savedVendor) {
      setVendor(JSON.parse(savedVendor));
    }
  }, []);

  // Save vendor info to localStorage whenever it changes
  useEffect(() => {
    if (vendor.name || vendor.phone) {
      localStorage.setItem('vendorInfo', JSON.stringify(vendor));
    }
  }, [vendor]);

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = discountEnabled ? (subtotal * discountRate) / 100 : 0;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxEnabled ? (taxableAmount * taxRate) / 100 : 0;
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  const generateInvoice = (): Invoice => {
    const invoiceNumber = `INV-${Date.now()}`;
    return {
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      vendor,
      customer,
      items,
      subtotal,
      taxRate: taxEnabled ? taxRate : 0,
      taxAmount,
      discountRate: discountEnabled ? discountRate : 0,
      discountAmount,
      total,
      notes
    };
  };

  const handleSave = () => {
    const invoice = generateInvoice();
    onSave(invoice);
    onBack();
  };

  if (showPreview) {
    return (
      <InvoicePreview 
        invoice={generateInvoice()} 
        onBack={() => setShowPreview(false)}
        onSave={handleSave}
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
          <h1 className="text-3xl font-bold text-gray-800">Create New Invoice</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vendor Information */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vendorName">Business Name *</Label>
                <Input
                  id="vendorName"
                  value={vendor.name}
                  onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                  placeholder="Your business name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vendorPhone">Phone Number *</Label>
                <Input
                  id="vendorPhone"
                  value={vendor.phone}
                  onChange={(e) => setVendor({ ...vendor, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vendorAddress">Address</Label>
                <Textarea
                  id="vendorAddress"
                  value={vendor.address || ''}
                  onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
                  placeholder="Your business address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vendorGst">GST Number</Label>
                <Input
                  id="vendorGst"
                  value={vendor.gst || ''}
                  onChange={(e) => setVendor({ ...vendor, gst: e.target.value })}
                  placeholder="GST Number (optional)"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Customer name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address</Label>
                <Textarea
                  id="customerAddress"
                  value={customer.address || ''}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Customer address"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">Items</CardTitle>
            <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="col-span-5">
                    <Label>Item Name *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Product/Service name"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total (₹)</Label>
                    <Input
                      value={`₹${item.total.toFixed(2)}`}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculations and Settings */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Add Tax (GST)</Label>
                  <p className="text-sm text-gray-600">Include tax in the invoice</p>
                </div>
                <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
              </div>
              {taxEnabled && (
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Add Discount</Label>
                  <p className="text-sm text-gray-600">Apply discount to the invoice</p>
                </div>
                <Switch checked={discountEnabled} onCheckedChange={setDiscountEnabled} />
              </div>
              {discountEnabled && (
                <div>
                  <Label htmlFor="discountRate">Discount Rate (%)</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    min="0"
                    max="100"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thank you for your business!"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountEnabled && discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({discountRate}%):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {taxEnabled && taxAmount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Tax ({taxRate}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">₹{total.toFixed(2)}</span>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={() => setShowPreview(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!vendor.name || !customer.name || items.some(item => !item.name)}
                >
                  Preview Invoice
                </Button>
                <Button 
                  onClick={handleSave}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  disabled={!vendor.name || !customer.name || items.some(item => !item.name)}
                >
                  Save Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
