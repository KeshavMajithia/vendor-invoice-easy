
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, Package, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice, Analytics as AnalyticsType } from '@/types/invoice';

interface AnalyticsProps {
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [analytics, setAnalytics] = useState<AnalyticsType>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    topCustomers: [],
    topItems: [],
    totalInvoices: 0,
    monthlyInvoices: 0
  });

  useEffect(() => {
    const invoicesData = localStorage.getItem('invoices');
    if (invoicesData) {
      const invoices: Invoice[] = JSON.parse(invoicesData);
      calculateAnalytics(invoices);
    }
  }, []);

  const calculateAnalytics = (invoices: Invoice[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.date);
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // Calculate top customers
    const customerMap = new Map<string, { total: number; count: number }>();
    invoices.forEach(inv => {
      const existing = customerMap.get(inv.customer.name) || { total: 0, count: 0 };
      customerMap.set(inv.customer.name, {
        total: existing.total + inv.total,
        count: existing.count + 1
      });
    });

    const topCustomers = Array.from(customerMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // Calculate top items
    const itemMap = new Map<string, { quantity: number; revenue: number }>();
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const existing = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        itemMap.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.total
        });
      });
    });

    const topItems = Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    setAnalytics({
      totalRevenue,
      monthlyRevenue,
      topCustomers,
      topItems,
      totalInvoices: invoices.length,
      monthlyInvoices: monthlyInvoices.length
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Business Analytics</h1>
          <p className="text-gray-600 mt-2">Track your business performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">₹{analytics.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">₹{analytics.monthlyRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{analytics.totalInvoices}</div>
              <div className="text-sm text-gray-600">Total Invoices</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{analytics.monthlyInvoices}</div>
              <div className="text-sm text-gray-600">Monthly Invoices</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Customers */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCustomers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No customer data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topCustomers.map((customer, index) => (
                    <div key={customer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.count} invoice{customer.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{customer.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No item data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.quantity} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{item.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
