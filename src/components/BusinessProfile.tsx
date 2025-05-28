
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Building, Phone, Mail, MapPin, CreditCard, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessProfile as BusinessProfileType } from '@/types/invoice';

interface BusinessProfileProps {
  onBack: () => void;
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<BusinessProfileType>({
    name: '',
    phone: '',
    address: '',
    email: '',
    gst: '',
    logo: '',
    upiId: '',
    customFooter: 'Thank you for your business!'
  });

  useEffect(() => {
    const stored = localStorage.getItem('businessProfile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('businessProfile', JSON.stringify(profile));
    alert('Business profile saved successfully!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Business Profile</h1>
          <p className="text-gray-600 mt-2">Set up your business information for invoices</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your business name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="businessPhone">Phone Number *</Label>
                <Input
                  id="businessPhone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="businessEmail">Email Address</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="business@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Your complete business address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={profile.gst || ''}
                  onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
                  placeholder="GST Number (optional)"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Branding & Payment */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Branding & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Business Logo</Label>
                <div className="mt-1 space-y-2">
                  {profile.logo && (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <img src={profile.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500">Upload your business logo (JPG, PNG)</p>
                </div>
              </div>

              <div>
                <Label htmlFor="upiId">UPI ID for Payments</Label>
                <Input
                  id="upiId"
                  value={profile.upiId || ''}
                  onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                  placeholder="yourname@paytm or yourname@gpay"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">This will generate a QR code on invoices</p>
              </div>

              <div>
                <Label htmlFor="customFooter">Custom Footer Text</Label>
                <Textarea
                  id="customFooter"
                  value={profile.customFooter || ''}
                  onChange={(e) => setProfile({ ...profile, customFooter: e.target.value })}
                  placeholder="Thank you for your business!"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">This text will appear at the bottom of your invoices</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            disabled={!profile.name || !profile.phone}
          >
            Save Business Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
