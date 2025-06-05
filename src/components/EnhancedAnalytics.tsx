
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
    dailySales: [],
    categorySales: [],
    topProducts: [],
    weeklySales: [],
    monthlySales: []
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

      // Load different analytics based on selected period
      const promises = [
        loadDailySales(),
        loadCategorySales(),
        loadTopProducts(),
        loadWeeklySales(),
        loadMonthlySales()
      ];

      await Promise.all(promises);
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

  const loadDailySales = async () => {
    const { data, error } = await supabase
      .from('sales_summary')
      .select('*')
      .eq('user_id', user!.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date');

    if (error) throw error;

    setAnalytics(prev => ({
      ...prev,
      dailySales: data?.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        sales: item.total_sales,
        profit: item.total_profit,
        bills: item.total_bills,
        invoices: item.total_invoices
      })) || []
    }));
  };

  const loadCategorySales = async () => {
    const { data, error } = await supabase
      .from('category_sales')
      .select('category, total_sales, total_quantity, total_profit')
      .eq('user_id', user!.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (error) throw error;

    // Group by category
    const grouped = data?.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          total_sales: 0,
          total_quantity: 0,
          total_profit: 0
        };
      }
      acc[item.category].total_sales += item.total_sales;
      acc[item.category].total_quantity += item.total_quantity;
      acc[item.category].total_profit += item.total_profit;
      return acc;
    }, {});

    setAnalytics(prev => ({
      ...prev,
      categorySales: Object.values(grouped || {})
    }));
  };

  const loadTopProducts = async () => {
    const { data, error } = await supabase
      .from('product_sales')
      .select(`
        product_id,
        quantity_sold,
        total_sales,
        total_profit,
        products(name)
      `)
      .eq('user_id', user!.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (error) throw error;

    // Group by product
    const grouped = data?.reduce((acc: any, item: any) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product_id: item.product_id,
          product_name: item.products?.name || 'Unknown',
          quantity_sold: 0,
          total_sales: 0,
          total_profit: 0
        };
      }
      acc[item.product_id].quantity_sold += item.quantity_sold;
      acc[item.product_id].total_sales += item.total_sales;
      acc[item.product_id].total_profit += item.total_profit;
      return acc;
    }, {});

    const topProducts = Object.values(grouped || {})
      .sort((a: any, b: any) => b.total_sales - a.total_sales)
      .slice(0, 10);

    setAnalytics(prev => ({
      ...prev,
      topProducts
    }));
  };

  const loadWeeklySales = async () => {
    const { data, error } = await supabase
      .from('weekly_sales_summary')
      .select('*')
      .eq('user_id', user!.id)
      .order('week_start_date', { ascending: false })
      .limit(12);

    if (error) throw error;

    setAnalytics(prev => ({
      ...prev,
      weeklySales: data?.map(item => ({
        week: `Week ${new Date(item.week_start_date).toLocaleDateString()}`,
        sales: item.total_sales,
        profit: item.total_profit
      })) || []
    }));
  };

  const loadMonthlySales = async () => {
    const { data, error } = await supabase
      .from('monthly_sales_summary')
      .select('*')
      .eq('user_id', user!.id)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(12);

    if (error) throw error;

    setAnalytics(prev => ({
      ...prev,
      monthlySales: data?.map(item => ({
        month: `${item.month}/${item.year}`,
        sales: item.total_sales,
        profit: item.total_profit
      })) || []
    }));
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
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{analytics.dailySales.reduce((sum: number, item: any) => sum + item.sales, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.categorySales[0]?.category || 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.topProducts[0]?.product_name || 'N/A'}
              </div>
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

          {/* Category Sales Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
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
                    dataKey="total_sales"
                  >
                    {analytics.categorySales.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products and Period Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly/Monthly Sales */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPeriod === 'week' ? 'Weekly' : 'Monthly'} Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={selectedPeriod === 'week' ? analytics.weeklySales : analytics.monthlySales}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={selectedPeriod === 'week' ? 'week' : 'month'} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#82ca9d" />
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
