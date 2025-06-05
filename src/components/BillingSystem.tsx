
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, Bill } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Receipt, Send, Printer } from 'lucide-react';
import BillForm from '@/components/BillForm';
import BillList from '@/components/BillList';

interface BillingSystemProps {
  onBack: () => void;
  user: User | null;
}

const BillingSystem = ({ onBack, user }: BillingSystemProps) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillForm, setShowBillForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load bills and products in parallel
      const [billsResponse, productsResponse] = await Promise.all([
        supabase
          .from('bills')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('name')
      ]);

      if (billsResponse.error) throw billsResponse.error;
      if (productsResponse.error) throw productsResponse.error;

      setBills(billsResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBill = async (billData: Omit<Bill, 'id' | 'user_id' | 'bill_number' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      // Generate bill number
      const { data: billNumber, error: billNumberError } = await supabase
        .rpc('generate_bill_number', { user_uuid: user.id });

      if (billNumberError) throw billNumberError;

      // Generate QR code token for sharing
      const qrToken = `bill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const qrExpires = new Date();
      qrExpires.setHours(qrExpires.getHours() + 24); // Expires in 24 hours

      const { data, error } = await supabase
        .from('bills')
        .insert({
          ...billData,
          user_id: user.id,
          bill_number: billNumber,
          qr_code_token: qrToken,
          qr_expires_at: qrExpires.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update inventory for each item
      for (const item of billData.items) {
        await supabase
          .from('products')
          .update({
            quantity_in_stock: supabase.sql`quantity_in_stock - ${item.quantity}`
          })
          .eq('id', item.product_id)
          .eq('user_id', user.id);

        // Record inventory transaction
        await supabase
          .from('inventory_transactions')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            transaction_type: 'sale',
            quantity: -item.quantity,
            reference_type: 'bill',
            reference_id: data.id,
            notes: `Sale via bill ${billNumber}`
          });
      }

      toast({
        title: "Success",
        description: "Bill created successfully!"
      });

      loadData();
      setShowBillForm(false);
    } catch (error: any) {
      console.error('Failed to create bill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create bill",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill deleted successfully!"
      });

      loadData();
    } catch (error: any) {
      console.error('Failed to delete bill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete bill",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing system...</p>
        </div>
      </div>
    );
  }

  if (showBillForm) {
    return (
      <BillForm
        products={products}
        onSave={handleSaveBill}
        onCancel={() => setShowBillForm(false)}
      />
    );
  }

  const todaysBills = bills.filter(bill => 
    new Date(bill.bill_date).toDateString() === new Date().toDateString()
  );

  const todaysRevenue = todaysBills.reduce((sum, bill) => sum + bill.total_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Billing System</h1>
          </div>
          <Button onClick={() => setShowBillForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Bill
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bills</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysBills.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{todaysRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bills.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Products</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bills List */}
        <BillList
          bills={bills}
          onDelete={handleDeleteBill}
        />
      </div>
    </div>
  );
};

export default BillingSystem;
