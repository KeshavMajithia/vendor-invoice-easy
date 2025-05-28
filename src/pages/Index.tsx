import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import BusinessSetup from '@/components/BusinessSetup';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import SavedInvoices from '@/components/SavedInvoices';
import CustomerList from '@/components/CustomerList';
import Analytics from '@/components/Analytics';
import BusinessProfile from '@/components/BusinessProfile';
import { BusinessProfile as BusinessProfileType, Invoice } from '@/types/invoice';

type AppState = 'landing' | 'auth' | 'setup' | 'dashboard' | 'create-invoice' | 'saved-invoices' | 'customers' | 'analytics' | 'business-profile';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [user, setUser] = useState<{ email: string; businessName: string } | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [duplicateInvoice, setDuplicateInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('quickvyapaar_user');
    const savedProfile = localStorage.getItem('businessProfile');
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setCurrentState('dashboard');
    }

    // Load saved invoices
    const savedInvoices = localStorage.getItem('quickvyapaar_invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  const handleGetStarted = () => {
    setCurrentState('auth');
  };

  const handleLogin = async (email: string, password: string) => {
    // In a real app, this would integrate with Supabase
    console.log('Login:', { email, password });
    
    // Mock successful login
    const userData = { email, businessName: 'Sample Business' };
    setUser(userData);
    localStorage.setItem('quickvyapaar_user', JSON.stringify(userData));
    
    const existingProfile = localStorage.getItem('businessProfile');
    if (existingProfile) {
      setCurrentState('dashboard');
    } else {
      setCurrentState('setup');
    }
  };

  const handleSignup = async (email: string, password: string, businessName: string) => {
    // In a real app, this would integrate with Supabase
    console.log('Signup:', { email, password, businessName });
    
    // Mock successful signup
    const userData = { email, businessName };
    setUser(userData);
    localStorage.setItem('quickvyapaar_user', JSON.stringify(userData));
    setCurrentState('setup');
  };

  const handleGoogleSignIn = async () => {
    // In a real app, this would integrate with Supabase Google Auth
    console.log('Google Sign In');
    
    // Mock successful Google login
    const userData = { email: 'user@gmail.com', businessName: 'Google Business' };
    setUser(userData);
    localStorage.setItem('quickvyapaar_user', JSON.stringify(userData));
    setCurrentState('setup');
  };

  const handleBusinessSetupComplete = (profile: BusinessProfileType) => {
    localStorage.setItem('businessProfile', JSON.stringify(profile));
    setCurrentState('dashboard');
  };

  const handleBusinessSetupSkip = () => {
    // Create minimal profile
    const minimalProfile = {
      name: user?.businessName || 'My Business',
      phone: '',
      customFooter: 'Thank you for your business!'
    };
    localStorage.setItem('businessProfile', JSON.stringify(minimalProfile));
    setCurrentState('dashboard');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    const invoiceWithId = { ...invoice, id: Date.now().toString() };
    const updatedInvoices = [...invoices, invoiceWithId];
    setInvoices(updatedInvoices);
    localStorage.setItem('quickvyapaar_invoices', JSON.stringify(updatedInvoices));
    
    // Save customer to customer list
    const savedCustomers = localStorage.getItem('customers');
    const customers = savedCustomers ? JSON.parse(savedCustomers) : [];
    const existingCustomer = customers.find((c: any) => c.phone === invoice.customer.phone);
    
    if (!existingCustomer) {
      const customerWithId = { ...invoice.customer, id: Date.now().toString(), lastUsed: new Date().toISOString() };
      customers.push(customerWithId);
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('quickvyapaar_invoices', JSON.stringify(updatedInvoices));
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setDuplicateInvoice(invoice);
    setCurrentState('create-invoice');
  };

  const handleNavigate = (section: string) => {
    setDuplicateInvoice(null); // Clear duplicate state when navigating
    switch (section) {
      case 'create-invoice':
        setCurrentState('create-invoice');
        break;
      case 'saved-invoices':
        setCurrentState('saved-invoices');
        break;
      case 'customers':
        setCurrentState('customers');
        break;
      case 'analytics':
        setCurrentState('analytics');
        break;
      case 'business-profile':
        setCurrentState('business-profile');
        break;
      case 'upgrade':
        // Handle upgrade to Pro
        setIsPro(true);
        alert('Upgraded to Pro! (Mock implementation)');
        break;
      default:
        setCurrentState('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quickvyapaar_user');
    localStorage.removeItem('businessProfile');
    setUser(null);
    setCurrentState('landing');
  };

  const handleBackToDashboard = () => {
    setDuplicateInvoice(null);
    setCurrentState('dashboard');
  };

  if (currentState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentState === 'auth') {
    return (
      <AuthPage
        onBack={() => setCurrentState('landing')}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  if (currentState === 'setup') {
    return (
      <BusinessSetup
        onComplete={handleBusinessSetupComplete}
        onSkip={handleBusinessSetupSkip}
      />
    );
  }

  if (currentState === 'dashboard') {
    return (
      <Dashboard
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        businessName={user?.businessName || 'My Business'}
        isPro={isPro}
      />
    );
  }

  if (currentState === 'create-invoice') {
    return (
      <InvoiceForm 
        onSave={handleSaveInvoice}
        onBack={handleBackToDashboard}
        duplicateFrom={duplicateInvoice}
      />
    );
  }

  if (currentState === 'saved-invoices') {
    return (
      <SavedInvoices 
        invoices={invoices}
        onDelete={handleDeleteInvoice}
        onDuplicate={handleDuplicateInvoice}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentState === 'customers') {
    return <CustomerList onBack={handleBackToDashboard} />;
  }

  if (currentState === 'analytics') {
    return <Analytics onBack={handleBackToDashboard} />;
  }

  if (currentState === 'business-profile') {
    return <BusinessProfile onBack={handleBackToDashboard} />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
};

export default Index;
