
import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  History, 
  Copy,
  CreditCard,
  Printer,
  Globe,
  Crown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
  businessName: string;
  isPro: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onLogout, businessName, isPro }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      id: 'create-invoice',
      title: 'Create New Invoice',
      description: 'Generate professional invoices instantly',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      primary: true
    },
    {
      id: 'saved-invoices',
      title: 'Saved Invoices',
      description: 'View and manage all your invoices',
      icon: FileText,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'customers',
      title: 'Customer List',
      description: 'Manage your customer database',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'analytics',
      title: 'Business Analytics',
      description: 'Track revenue and performance',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'templates',
      title: 'Invoice Templates',
      description: 'Choose from professional templates',
      icon: FileText,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'business-profile',
      title: 'Business Profile',
      description: 'Update your business information',
      icon: Settings,
      color: 'from-slate-500 to-slate-600'
    }
  ];

  const quickStats = [
    { label: 'Invoices This Month', value: '24', change: '+12%' },
    { label: 'Revenue This Month', value: '₹45,000', change: '+8%' },
    { label: 'Total Customers', value: '156', change: '+5%' },
    { label: 'Avg. Invoice Value', value: '₹1,875', change: '+3%' }
  ];

  const handleFeatureClick = (featureId: string) => {
    setSidebarOpen(false);
    onNavigate(featureId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:shadow-none`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{businessName}</h2>
              <div className="flex items-center mt-1">
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600 font-medium">Pro</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Free Plan</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Button
            onClick={() => onNavigate('upgrade')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 mb-4"
          >
            <Crown className="w-4 h-4 mr-2" />
            {isPro ? 'Manage Pro' : 'Upgrade to Pro'}
          </Button>

          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              </div>
              <div className="text-sm text-gray-500">
                Welcome back! Here's your business overview.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Card 
                  key={feature.id}
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                    feature.primary ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
