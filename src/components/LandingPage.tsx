
import React from 'react';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    "Create Professional Invoices",
    "Auto-Save Customer Details", 
    "UPI Payment QR Codes",
    "Business Analytics Dashboard",
    "Duplicate Previous Invoices",
    "Export to PDF & Share",
    "Multi-language Support",
    "Offline-first Design"
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Kirana Store Owner",
      text: "QuickVyapaar made my billing so simple. My customers love the professional invoices!",
      rating: 5
    },
    {
      name: "Priya Sharma", 
      business: "Freelance Tutor",
      text: "Perfect for my tuition business. The duplicate feature saves me so much time!",
      rating: 5
    },
    {
      name: "Mohammed Ali",
      business: "Mobile Repair Shop", 
      text: "UPI QR codes on invoices helped me get payments instantly. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              QuickVyapaar
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Professional Invoices for
            <span className="text-blue-600"> Small Businesses</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning invoices in seconds. Perfect for street vendors, shopkeepers, 
            freelancers, and small business owners who want to look professional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
            >
              Start Creating Invoices <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>No signup required for trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need to Run Your Business
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="font-medium text-gray-800">{feature}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Happy Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500,000+</div>
              <div className="text-blue-100">Invoices Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Our Users Say
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.business}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of small businesses already using QuickVyapaar
          </p>
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
          >
            Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
