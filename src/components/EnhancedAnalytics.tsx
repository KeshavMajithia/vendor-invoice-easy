
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Package, DollarSign, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface EnhancedAnalyticsProps {
  onBack: () => void;
  user: User | null;
}

const EnhancedAnalytics = ({ onBack, user }: EnhancedAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    dailySales: [] as any[],
    categorySales: [] as any[],
    topProducts: [] as any[],
    recentTransactions: [] as any[]
  });
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, selectedPeriod]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await Promise.all([
        loadRecentBills(),
        loadProductAnalytics(),
        loadInvoiceAnalytics()
      ]);
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentBills = async () => {
    try {
      const { data: bills, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', user!.id)
        .gte('bill_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('bill_date');

      if (error) throw error;

      // Process daily sales
      const dailySalesMap = new Map();
      
      bills?.forEach(bill => {
        const date = new Date(bill.bill_date).toLocaleDateString();
        if (!dailySalesMap.has(date)) {
          dailySalesMap.set(date, { date, sales: 0, bills: 0 });
        }
        const current = dailySalesMap.get(date);
        current.sales += bill.total_amount;
        current.bills += 1;
      });

      setAnalytics(prev => ({
        ...prev,
        dailySales: Array.from(dailySalesMap.values()),
        recentTransactions: bills || []
      }));
    } catch (error) {
      console.error('Failed to load bills:', error);
    }
  };

  const loadProductAnalytics = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;

      // Group by category
      const categoryMap = new Map();
      const topProducts: any[] = [];

      products?.forEach(product => {
        const category = product.category || 'Uncategorized';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { category, total_value: 0, product_count: 0 });
        }
        const current = categoryMap.get(category);
        current.total_value += product.price * product.quantity_in_stock;
        current.product_count += 1;

        // Add to top products based on stock value
        topProducts.push({
          product_name: product.name,
          total_value: product.price * product.quantity_in_stock,
          stock: product.quantity_in_stock,
          price: product.price
        });
      });

      // Sort top products by value
      topProducts.sort((a, b) => b.total_value - a.total_value);

      setAnalytics(prev => ({
        ...prev,
        categorySales: Array.from(categoryMap.values()),
        topProducts: topProducts.slice(0, 10)
      }));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadInvoiceAnalytics = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user!.id)
        .gte('invoice_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Add invoice data to daily sales
      const invoiceSalesMap = new Map();
      
      invoices?.forEach(invoice => {
        const date = new Date(invoice.invoice_date).toLocaleDateString();
        if (!invoiceSalesMap.has(date)) {
          invoiceSalesMap.set(date, { date, sales: 0, invoices: 0 });
        }
        const current = invoiceSalesMap.get(date);
        current.sales += invoice.total_amount;
        current.invoices += 1;
      });

      // Merge with existing daily sales
      setAnalytics(prev => {
        const combined = new Map();
        
        // Add bill data
        prev.dailySales.forEach(day => {
          combined.set(day.date, { ...day });
        });
        
        // Add invoice data
        Array.from(invoiceSalesMap.values()).forEach(day => {
          if (combined.has(day.date)) {
            const existing = combined.get(day.date);
            existing.sales += day.sales;
            existing.invoices = day.invoices;
          } else {
            combined.set(day.date, { ...day, bills: 0 });
          }
        });

        return {
          ...prev,
          dailySales: Array.from(combined.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        };
      });
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalSales = analytics.dailySales.reduce((sum, item) => sum + item.sales, 0);
  const topCategory = analytics.categorySales.length > 0 ? analytics.categorySales[0]?.category : 'N/A';
  const bestProduct = analytics.topProducts.length > 0 ? analytics.topProducts[0]?.product_name : 'N/A';

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
            <h1 className="text-3xl font-bold text-gray-800">Enhanced Analytics</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
            >
              Weekly
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales (30 days)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Product</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestProduct}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.categorySales.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_value"
                  >
                    {analytics.categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
