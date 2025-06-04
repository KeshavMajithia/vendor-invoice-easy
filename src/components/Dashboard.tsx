
import React from 'react';
import { Plus, FileText, Users, BarChart3, Settings, TrendingUp, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  onCreateInvoice: () => void;
  onViewSaved: () => void;
  onViewTemplates: () => void;
  onViewCustomers: () => void;
  onViewAnalytics: () => void;
  onViewProfile: () => void;
  invoiceCount: number;
  totalRevenue: number;
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  onCreateInvoice,
  onViewSaved,
  onViewTemplates,
  onViewCustomers,
  onViewAnalytics,
  onViewProfile,
  invoiceCount = 0,
  totalRevenue = 0,
  user
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.user_metadata?.business_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {userName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your invoices and grow your business
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={onViewProfile}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={onCreateInvoice}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{invoiceCount}</div>
              <p className="text-xs text-gray-600 mt-1">
                {invoiceCount === 0 ? 'Create your first invoice' : 'Invoices created'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {totalRevenue > 0 ? 'From all invoices' : 'Start earning today'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {new Date().toLocaleDateString('en-IN', { month: 'long' })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Current period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Invoice */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onCreateInvoice}>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Invoice</h3>
                <p className="text-gray-600 text-sm">
                  Generate professional invoices for your clients
                </p>
              </div>
            </CardContent>
          </Card>

          {/* View Saved */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onViewSaved}>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Saved Invoices</h3>
                <p className="text-gray-600 text-sm">
                  View and manage all your invoices ({invoiceCount})
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onViewTemplates}>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Templates</h3>
                <p className="text-gray-600 text-sm">
                  Save and reuse invoice templates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customers */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onViewCustomers}>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Customers</h3>
                <p className="text-gray-600 text-sm">
                  Manage your customer database
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onViewAnalytics}>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics</h3>
                <p className="text-gray-600 text-sm">
                  View business insights and reports
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Business Profile */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6" onClick={onViewProfile}>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Profile</h3>
                <p className="text-gray-600 text-sm">
                  Update your business information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        {invoiceCount === 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg mt-8">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome to Your Invoice Dashboard! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first invoice. It's quick and easy!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={onCreateInvoice}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Invoice
                  </Button>
                  <Button
                    onClick={onViewProfile}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Setup Business Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
