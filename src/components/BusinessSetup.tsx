
import React, { useState } from 'react';
import { ArrowRight, Upload, Building, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BusinessProfile } from '@/types/invoice';

interface BusinessSetupProps {
  onComplete: (profile: BusinessProfile) => void;
  onSkip: () => void;
}

const BusinessSetup: React.FC<BusinessSetupProps> = ({ onComplete, onSkip }) => {
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    phone: '',
    address: '',
    email: '',
    gst: '',
    logo: '',
    upiId: '',
    customFooter: 'Thank you for your business!'
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.name.trim() && profile.phone.trim();
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Set Up Your Business Profile
            </CardTitle>
            <p className="text-gray-600">
              Let's personalize QuickVyapaar for your business
            </p>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="businessName"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Your business name"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="businessPhone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessEmail">Email Address (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="businessEmail"
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="business@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
                
                <div>
                  <Label htmlFor="businessAddress">Business Address (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <Textarea
                      id="businessAddress"
                      value={profile.address || ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Your complete business address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                  <Input
                    id="gstNumber"
                    value={profile.gst || ''}
                    onChange={(e) => setProfile({ ...profile, gst: e.target.value })}
                    placeholder="GST Number"
                  />
                </div>

                <div>
                  <Label htmlFor="upiId">UPI ID for Payments (Optional)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="upiId"
                      value={profile.upiId || ''}
                      onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                      placeholder="yourname@paytm or yourname@gpay"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Branding (Optional)</h3>
                
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
                  </div>
                </div>

                <div>
                  <Label htmlFor="customFooter">Custom Footer Text</Label>
                  <Textarea
                    id="customFooter"
                    value={profile.customFooter || ''}
                    onChange={(e) => setProfile({ ...profile, customFooter: e.target.value })}
                    placeholder="Thank you for your business!"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={onSkip}
                className="text-gray-600"
              >
                Skip for now
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {currentStep === 3 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSetup;
