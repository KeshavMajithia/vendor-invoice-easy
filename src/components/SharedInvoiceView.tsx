
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InvoicePreview from './InvoicePreview';

interface SharedInvoiceViewProps {
  token: string;
  onBack: () => void;
}

const SharedInvoiceView: React.FC<SharedInvoiceViewProps> = ({ token, onBack }) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSharedInvoice();
  }, [token]);

  const loadSharedInvoice = async () => {
    try {
      // First get the shared invoice record
      const { data: sharedData, error: sharedError } = await supabase
        .from('shared_invoices')
        .select('*, invoices(*)')
        .eq('share_token', token)
        .eq('is_active', true)
        .single();

      if (sharedError) throw new Error('Invoice not found or link has expired');

      // Check if the share link has expired
      if (sharedData.expires_at && new Date(sharedData.expires_at) < new Date()) {
        throw new Error('This share link has expired');
      }

      if (!sharedData.invoices) {
        throw new Error('Invoice data not found');
      }

      // Transform the invoice data to match our frontend format
      const invoiceData = sharedData.invoices;
      const transformedInvoice = {
        id: invoiceData.id,
        invoiceNumber: invoiceData.invoice_number,
        date: invoiceData.invoice_date,
        vendor: {
          name: 'Business Name', // We'll get this from the user's profile
          phone: '',
          address: '',
          email: '',
          gst: ''
        },
        customer: {
          name: invoiceData.client_name,
          email: invoiceData.client_email,
          address: invoiceData.client_address
        },
        items: invoiceData.items || [],
        subtotal: invoiceData.subtotal,
        taxAmount: invoiceData.tax_amount,
        total: invoiceData.total_amount,
        notes: 'Thank you for your business!'
      };

      setInvoice(transformedInvoice);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this invoice: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Invoice Not Available</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button
              onClick={handleWhatsAppShare}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share via WhatsApp
            </Button>
          </div>
        </div>

        <InvoicePreview
          invoice={invoice}
          onBack={() => {}}
          onSave={() => {}}
          isSharedView={true}
        />
      </div>
    </div>
  );
};

export default SharedInvoiceView;
