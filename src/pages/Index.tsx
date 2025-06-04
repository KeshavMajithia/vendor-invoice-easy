
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { transformDatabaseInvoice, transformInvoiceForDatabase } from '@/utils/invoiceTransforms';
import { Invoice } from '@/types/invoice';
import { User } from '@supabase/supabase-js';

// Component imports
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import InvoiceForm from '@/components/InvoiceForm';
import SavedInvoices from '@/components/SavedInvoices';
import InvoiceTemplates from '@/components/InvoiceTemplates';
import CustomerList from '@/components/CustomerList';
import Analytics from '@/components/Analytics';
import BusinessProfile from '@/components/BusinessProfile';
import BusinessSetup from '@/components/BusinessSetup';
import SharedInvoiceView from '@/components/SharedInvoiceView';

type View = 'landing' | 'auth' | 'dashboard' | 'create' | 'saved' | 'templates' | 'customers' | 'analytics' | 'profile' | 'setup' | 'shared';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [duplicateInvoice, setDuplicateInvoice] = useState<Invoice | null>(null);
  const [templateData, setTemplateData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for shared invoice token
    const shareToken = searchParams.get('token');
    if (shareToken) {
      setView('shared');
      setLoading(false);
      return;
    }

    // Check authentication
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        checkBusinessSetup(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        setView('landing');
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await checkBusinessSetup(session.user);
      } else {
        setView('landing');
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const checkBusinessSetup = async (currentUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('business_name, business_phone')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
      }

      if (!profile?.business_name || !profile?.business_phone) {
        setView('setup');
      } else {
        setView('dashboard');
        await loadInvoices(currentUser);
      }
    } catch (error) {
      console.error('Business setup check failed:', error);
      setView('dashboard'); // Fallback to dashboard
    }
  };

  const loadInvoices = async (currentUser: User) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load invoices:', error);
        toast({
          title: "Warning",
          description: "Could not load invoices. You can still create new ones.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        const transformedInvoices = data.map(transformDatabaseInvoice);
        setInvoices(transformedInvoices);
      }
    } catch (error) {
      console.error('Invoice loading error:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    }
  };

  const handleSaveInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save invoices",
        variant: "destructive"
      });
      return;
    }

    try {
      const invoiceData = transformInvoiceForDatabase(invoice, user.id);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newInvoice = transformDatabaseInvoice(data);
        setInvoices(prev => [newInvoice, ...prev]);
        
        toast({
          title: "Success",
          description: "Invoice saved successfully!"
        });
        
        setView('dashboard');
        setDuplicateInvoice(null);
        setTemplateData(null);
      }
    } catch (error: any) {
      console.error('Save invoice error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId)
        .eq('user_id', user.id);

      if (error) throw error;

      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully!"
      });
    } catch (error: any) {
      console.error('Delete invoice error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    setDuplicateInvoice(invoice);
    setTemplateData(null);
    setView('create');
  };

  const handleCreateFromTemplate = (template: any) => {
    setTemplateData(template);
    setDuplicateInvoice(null);
    setView('create');
  };

  const handleBusinessSetupComplete = () => {
    setView('dashboard');
    if (user) {
      loadInvoices(user);
    }
  };

  const handleAuthLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAuthSignup = async (email: string, password: string, businessName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName }
        }
      });
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account."
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
          redirectTo: window.location.origin
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

  // Loading state
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

  // Error boundary
  try {
    // Render based on current view
    switch (view) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => setView('auth')} 
          />
        );

      case 'auth':
        return (
          <AuthPage 
            onBack={() => setView('landing')}
            onLogin={handleAuthLogin}
            onSignup={handleAuthSignup}
            onGoogleSignIn={handleGoogleSignIn}
          />
        );

      case 'setup':
        return (
          <BusinessSetup 
            onComplete={handleBusinessSetupComplete}
            onSkip={handleBusinessSetupComplete}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            onCreateInvoice={() => {
              setDuplicateInvoice(null);
              setTemplateData(null);
              setView('create');
            }}
            onViewSaved={() => setView('saved')}
            onViewTemplates={() => setView('templates')}
            onViewCustomers={() => setView('customers')}
            onViewAnalytics={() => setView('analytics')}
            onViewProfile={() => setView('profile')}
            invoiceCount={invoices.length}
            totalRevenue={invoices.reduce((sum, inv) => sum + inv.total, 0)}
            user={user}
          />
        );

      case 'create':
        return (
          <InvoiceForm
            onSave={handleSaveInvoice}
            onBack={() => setView('dashboard')}
            duplicateFrom={duplicateInvoice}
            templateData={templateData}
            user={user}
          />
        );

      case 'saved':
        return (
          <SavedInvoices
            invoices={invoices}
            onDelete={handleDeleteInvoice}
            onDuplicate={handleDuplicateInvoice}
            onBack={() => setView('dashboard')}
            user={user}
          />
        );

      case 'templates':
        return (
          <InvoiceTemplates
            onBack={() => setView('dashboard')}
            user={user}
          />
        );

      case 'customers':
        return (
          <CustomerList
            onBack={() => setView('dashboard')}
            user={user}
          />
        );

      case 'analytics':
        return (
          <Analytics
            onBack={() => setView('dashboard')}
          />
        );

      case 'profile':
        return (
          <BusinessProfile
            onBack={() => setView('dashboard')}
          />
        );

      case 'shared':
        const shareToken = searchParams.get('token');
        if (!shareToken) {
          setView('landing');
          return null;
        }
        return (
          <SharedInvoiceView
            token={shareToken}
            onBack={() => setView('landing')}
          />
        );

      default:
        return (
          <LandingPage 
            onGetStarted={() => setView('auth')} 
          />
        );
    }
  } catch (error) {
    console.error('Render error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Index;
