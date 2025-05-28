
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Eye, Copy, Trash2, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface Template {
  id: string;
  name: string;
  template_data: any;
  created_at: string;
}

interface InvoiceTemplatesProps {
  onBack: () => void;
  onUseTemplate: (template: any) => void;
  user: User | null;
}

const InvoiceTemplates: React.FC<InvoiceTemplatesProps> = ({ onBack, onUseTemplate, user }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async () => {
    if (!user || !templateName.trim()) return;

    try {
      const defaultTemplateData = {
        vendor: {
          name: '',
          phone: '',
          address: '',
          email: '',
          gst: ''
        },
        items: [
          { id: '1', name: '', quantity: 1, price: 0, total: 0 }
        ],
        taxEnabled: false,
        taxRate: 18,
        discountEnabled: false,
        discountRate: 0,
        notes: 'Thank you for your business!'
      };

      const { error } = await supabase
        .from('invoice_templates')
        .insert({
          user_id: user.id,
          name: templateName,
          template_data: defaultTemplateData
        });

      if (error) throw error;

      await loadTemplates();
      setIsDialogOpen(false);
      setTemplateName('');
      
      toast({
        title: "Success",
        description: "Template created successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('invoice_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadTemplates();
      toast({
        title: "Success",
        description: "Template deleted successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const defaultTemplates = [
    {
      id: 'basic',
      name: 'Basic Invoice',
      description: 'Simple invoice template for general use',
      template_data: {
        vendor: { name: '', phone: '', address: '', email: '', gst: '' },
        items: [{ id: '1', name: 'Service/Product', quantity: 1, price: 0, total: 0 }],
        taxEnabled: true,
        taxRate: 18,
        discountEnabled: false,
        discountRate: 0,
        notes: 'Thank you for your business!'
      }
    },
    {
      id: 'service',
      name: 'Service Invoice',
      description: 'Template for service-based businesses',
      template_data: {
        vendor: { name: '', phone: '', address: '', email: '', gst: '' },
        items: [
          { id: '1', name: 'Consultation Fee', quantity: 1, price: 0, total: 0 },
          { id: '2', name: 'Service Charge', quantity: 1, price: 0, total: 0 }
        ],
        taxEnabled: true,
        taxRate: 18,
        discountEnabled: true,
        discountRate: 10,
        notes: 'Payment due within 30 days. Thank you for choosing our services!'
      }
    },
    {
      id: 'retail',
      name: 'Retail Invoice',
      description: 'Template for retail businesses',
      template_data: {
        vendor: { name: '', phone: '', address: '', email: '', gst: '' },
        items: [
          { id: '1', name: 'Product 1', quantity: 1, price: 0, total: 0 },
          { id: '2', name: 'Product 2', quantity: 1, price: 0, total: 0 },
          { id: '3', name: 'Product 3', quantity: 1, price: 0, total: 0 }
        ],
        taxEnabled: true,
        taxRate: 18,
        discountEnabled: false,
        discountRate: 0,
        notes: 'All sales are final. Thank you for shopping with us!'
      }
    }
  ];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Invoice Templates</h1>
              <p className="text-gray-600 mt-2">Create and manage invoice templates</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input
                      id="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g., Service Invoice, Retail Invoice"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateTemplate} className="flex-1">
                      Create Template
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Default Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Start Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultTemplates.map((template) => (
              <Card key={template.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <Button
                    onClick={() => onUseTemplate(template.template_data)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Templates</h2>
          {templates.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Custom Templates Yet</h3>
                <p className="text-gray-500 mb-6">Create your own templates to save time on future invoices</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Created on {new Date(template.created_at).toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => onUseTemplate(template.template_data)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplates;
