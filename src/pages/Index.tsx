
import React, { useState, useEffect } from 'react';
import { Plus, FileText, History, BarChart3, Users, Settings, Copy, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceForm from '@/components/InvoiceForm';
import SavedInvoices from '@/components/SavedInvoices';
import CustomerList from '@/components/CustomerList';
import Analytics from '@/components/Analytics';
import BusinessProfile from '@/components/BusinessProfile';
import { Invoice } from '@/types/invoice';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'saved' | 'customers' | 'analytics' | 'profile' | 'duplicate'>('dashboard');
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [duplicateInvoice, setDuplicateInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    // Load saved invoices from localStorage
    const stored = localStorage.getItem('invoices');
    if (stored) {
      setSavedInvoices(JSON.parse(stored));
    }
  }, []);

  const handleSaveInvoice = (invoice: Invoice) => {
    const updatedInvoices = [...savedInvoices, { ...invoice, id: Date.now().toString() }];
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    // Save customer to customer list
    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customerExists = existingCustomers.find((c: any) => c.phone === invoice.customer.phone);
    
    if (!customerExists) {
      const newCustomer = {
        ...invoice.customer,
        id: Date.now().toString(),
        lastUsed: new Date().toISOString()
      };
      const updatedCustomers = [...existingCustomers, newCustomer];
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    }
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = savedInvoices.filter(inv => inv.id !== id);
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setDuplicateInvoice(invoice);
    setCurrentView('duplicate');
  };

  if (currentView === 'create' || currentView === 'duplicate') {
    return (
      <InvoiceForm 
        onSave={handleSaveInvoice} 
        onBack={() => setCurrentView('dashboard')}
        duplicateFrom={currentView === 'duplicate' ? duplicateInvoice : undefined}
      />
    );
  }

  if (currentView === 'saved') {
    return (
      <SavedInvoices 
        invoices={savedInvoices}
        onDelete={handleDeleteInvoice}
        onDuplicate={handleDuplicateInvoice}
        onBack={() => setCurrentView('dashboard')} 
      />
    );
  }

  if (currentView === 'customers') {
    return <CustomerList onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'analytics') {
    return <Analytics onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'profile') {
    return <BusinessProfile onBack={() => setCurrentView('dashboard')} />;
  }

  // Free tier limitations
  const isFreeTier = true; // This would be based on user subscription
  const weeklyInvoiceLimit = 10;
  const thisWeekInvoices = savedInvoices.filter(inv => {
    const invoiceDate = new Date(inv.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return invoiceDate > weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickVyapaar</h1>
          <p className="text-gray-600 text-lg">Professional invoices for small businesses</p>
          
          {isFreeTier && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm">
              <Crown className="w-4 h-4 mr-2" />
              Free Plan: {thisWeekInvoices}/{weeklyInvoiceLimit} invoices this week
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{savedInvoices.length}</div>
              <div className="text-gray-600">Total Invoices</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                ₹{savedInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Revenue</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{thisWeekInvoices}</div>
              <div className="text-gray-600">This Week</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {new Set(savedInvoices.map(inv => inv.customer.name)).size}
              </div>
              <div className="text-gray-600">Customers</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" 
            onClick={() => setCurrentView('create')}
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-gray-800">Create Invoice</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-600 mb-4">Generate a new professional invoice</p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                disabled={isFreeTier && thisWeekInvoices >= weeklyInvoiceLimit}
              >
                {isFreeTier && thisWeekInvoices >= weeklyInvoiceLimit ? 'Limit Reached' : 'Start Creating'}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" 
            onClick={() => setCurrentView('saved')}
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <History className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-gray-800">Saved Invoices</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-600 mb-4">View and manage your invoices</p>
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                View All ({savedInvoices.length})
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" 
            onClick={() => setCurrentView('analytics')}
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-gray-800">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-600 mb-4">Track your business performance</p>
              <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white">
                View Insights
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" 
            onClick={() => setCurrentView('customers')}
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-gray-800">Customers</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-600 mb-4">Manage your customer database</p>
              <Button variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white">
                View List
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" 
            onClick={() => setCurrentView('profile')}
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl text-gray-800">Business Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-gray-600 mb-4">Set up your business details</p>
              <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white">
                Manage Profile
              </Button>
            </CardContent>
          </Card>

          {/* Pro Upgrade Card */}
          {isFreeTier && (
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl">Upgrade to Pro</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="mb-4">Remove watermark, add logo, unlimited invoices</p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  ₹199/year
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Invoices */}
        {savedInvoices.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-800">Recent Invoices</CardTitle>
              <Button variant="ghost" onClick={() => setCurrentView('saved')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedInvoices.slice(-3).reverse().map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.customer.name} • {new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-green-600">₹{invoice.total.toLocaleString()}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicateInvoice(invoice)}
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
