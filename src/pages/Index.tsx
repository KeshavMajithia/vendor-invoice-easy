
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import BusinessSetup from '@/components/BusinessSetup';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import SavedInvoices from '@/components/SavedInvoices';
import CustomerList from '@/components/CustomerList';
import Analytics from '@/components/Analytics';
import BusinessProfile from '@/components/BusinessProfile';
import InvoiceTemplates from '@/components/InvoiceTemplates';
import SharedInvoiceView from '@/components/SharedInvoiceView';
import { BusinessProfile as BusinessProfileType, Invoice } from '@/types/invoice';
import { transformDatabaseInvoice, transformInvoiceForDatabase } from '@/utils/invoiceTransforms';
import { useToast } from '@/hooks/use-toast';

type AppState = 'landing' | 'auth' | 'setup' | 'dashboard' | 'create-invoice' | 'saved-invoices' | 'customers' | 'analytics' | 'business-profile' | 'templates' | 'shared-invoice';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [duplicateInvoice, setDuplicateInvoice] = useState<Invoice | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [sharedToken, setSharedToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has completed business setup
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile && profile.business_name) {
            setCurrentState('dashboard');
          } else {
            setCurrentState('setup');
          }
          
          // Load user's invoices
          loadInvoices();
        } else {
          setCurrentState('landing');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for shared invoice token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setSharedToken(token);
      setCurrentState('shared-invoice');
    }

    return () => subscription.unsubscribe();
  }, []);

  const loadInvoices = async () => {
    if (!session?.user) return;
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    } else {
      // Transform database invoices to frontend Invoice type
      const transformedInvoices = (data || []).map(transformDatabaseInvoice);
      setInvoices(transformedInvoices);
    }
  };

  const handleGetStarted = () => {
    setCurrentState('auth');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged in successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (email: string, password: string, businessName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleBusinessSetupComplete = async (profile: BusinessProfileType) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          business_name: profile.name,
          business_phone: profile.phone,
          business_address: profile.address,
          business_gstin: profile.gst
        });
        
      if (error) throw error;
      
      setCurrentState('dashboard');
      toast({
        title: "Success",
        description: "Business profile setup completed!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleBusinessSetupSkip = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          business_name: 'My Business'
        });
        
      if (error) throw error;
      
      setCurrentState('dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) return;
    
    try {
      const invoiceData = transformInvoiceForDatabase(invoice, user.id);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();
        
      if (error) throw error;
      
      await loadInvoices();
      toast({
        title: "Success",
        description: "Invoice saved successfully!"
      });
      
      // Also save customer if new
      await saveCustomer(invoice.customer);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const saveCustomer = async (customer: any) => {
    if (!user || !customer.name) return;
    
    try {
      // Check if customer already exists
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', customer.name)
        .single();
        
      if (!existing) {
        await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            name: customer.name,
            email: customer.email || null,
            phone: customer.phone || null,
            address: customer.address || null
          });
      }
    } catch (error) {
      // Ignore errors for customer saving
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      await loadInvoices();
      toast({
        title: "Success",
        description: "Invoice deleted successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setDuplicateInvoice(invoice);
    setCurrentState('create-invoice');
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCurrentState('create-invoice');
  };

  const handleNavigate = (section: string) => {
    setDuplicateInvoice(null);
    setSelectedTemplate(null);
    
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
      case 'templates':
        setCurrentState('templates');
        break;
      case 'upgrade':
        setIsPro(true);
        toast({
          title: "Upgraded to Pro!",
          description: "You now have access to all premium features."
        });
        break;
      default:
        setCurrentState('dashboard');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentState('landing');
    setUser(null);
    setSession(null);
    setInvoices([]);
  };

  const handleBackToDashboard = () => {
    setDuplicateInvoice(null);
    setSelectedTemplate(null);
    setCurrentState('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentState === 'shared-invoice' && sharedToken) {
    return <SharedInvoiceView token={sharedToken} onBack={() => setCurrentState('landing')} />;
  }

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
        businessName={user?.user_metadata?.business_name || 'My Business'}
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
        templateData={selectedTemplate}
        user={user}
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
        user={user}
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

  if (currentState === 'templates') {
    return (
      <InvoiceTemplates 
        onBack={handleBackToDashboard}
        onUseTemplate={handleUseTemplate}
        user={user}
      />
    );
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
};

export default Index;
