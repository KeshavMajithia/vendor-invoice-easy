
import React, { useState, useEffect } from 'react';
import { Plus, FileText, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceForm from '@/components/InvoiceForm';
import SavedInvoices from '@/components/SavedInvoices';
import { Invoice } from '@/types/invoice';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'saved'>('dashboard');
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);

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
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = savedInvoices.filter(inv => inv.id !== id);
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  if (currentView === 'create') {
    return (
      <InvoiceForm 
        onSave={handleSaveInvoice} 
        onBack={() => setCurrentView('dashboard')} 
      />
    );
  }

  if (currentView === 'saved') {
    return (
      <SavedInvoices 
        invoices={savedInvoices}
        onDelete={handleDeleteInvoice}
        onBack={() => setCurrentView('dashboard')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice Generator</h1>
          <p className="text-gray-600 text-lg">Create professional invoices for your business instantly</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-gray-600">Total Value</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {savedInvoices.length > 0 ? new Date(Math.max(...savedInvoices.map(inv => new Date(inv.date).getTime()))).toLocaleDateString() : 'No invoices'}
              </div>
              <div className="text-gray-600">Last Invoice</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setCurrentView('create')}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-gray-600 mb-6">Generate a professional invoice with automatic calculations and PDF export</p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                onClick={() => setCurrentView('create')}
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => setCurrentView('saved')}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <History className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Saved Invoices</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-gray-600 mb-6">View, edit, or download your previously created invoices</p>
              <Button 
                variant="outline" 
                className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                onClick={() => setCurrentView('saved')}
              >
                View Invoices ({savedInvoices.length})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Why Choose Our Invoice Generator?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Professional Templates</h3>
              <p className="text-gray-600 text-sm">Beautiful, ready-to-use invoice templates that make your business look professional</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy to Use</h3>
              <p className="text-gray-600 text-sm">Simple interface designed for small business owners with no technical knowledge required</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Offline Storage</h3>
              <p className="text-gray-600 text-sm">All your data is stored locally on your device. No internet required, complete privacy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
