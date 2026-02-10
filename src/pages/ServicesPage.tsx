import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle,
  Globe,
  Zap,
  Users,
  Award,
  Target,
  Building,
  Anchor,
  Plane,
  Ship,
  FileText,
  Briefcase,
  Wrench,
  Calculator,
  BarChart3,
  Search,
  Warehouse,
  Container,
  Scale,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTE_PATHS } from '@/lib/index';
import { useLanguageContext } from '@/lib/LanguageContext';
import { IMAGES } from '@/assets/images';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
}

interface PricingData {
  id: string;
  service_type: string;
  region: string;
  destination: string;
  weight_min: number;
  weight_max: number;
  price_per_kg: number;
  currency: string;
}

export default function ServicesPage() {
  const { t } = useLanguageContext();
  const [services, setServices] = useState<Service[]>([]);
  const [pricing, setPricing] = useState<PricingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesData();
    fetchPricingData();
  }, []);

  const fetchServicesData = async () => {
    try {
      const { data, error } = await supabase
        .from('services_2026_02_03_21_00')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchPricingData = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_2026_02_03_21_00')
        .select('*')
        .eq('is_active', true)
        .order('region, destination, weight_min');

      if (error) throw error;
      setPricing(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setLoading(false);
    }
  };

  const getPricingByRegion = (region: string) => {
    return pricing.filter(p => p.region === region && p.service_type === 'international');
  };

  const getDomesticPricing = () => {
    return pricing.filter(p => p.service_type === 'domestic');
  };

  const getServiceIcon = (iconClass: string) => {
    switch (iconClass) {
      case 'fas fa-truck-fast':
        return <Truck className="w-8 h-8 text-white" />;
      case 'fas fa-hand-holding-usd':
        return <Package className="w-8 h-8 text-white" />;
      case 'fas fa-plane-departure':
        return <Plane className="w-8 h-8 text-white" />;
      default:
        return <Package className="w-8 h-8 text-white" />;
    }
  };

  const getServiceColor = (category: string) => {
    switch (category) {
      case 'domestic':
        return 'from-blue-500 to-blue-600';
      case 'ecommerce':
        return 'from-green-500 to-green-600';
      case 'international':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'domestic':
        return 'bg-blue-50 text-blue-700';
      case 'ecommerce':
        return 'bg-green-50 text-green-700';
      case 'international':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-transparent to-navy-900/70" />
        <img 
          src={IMAGES.LOGISTICS_HERO_2} 
          alt="Logistics Services" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              {t('services.title')}
            </h1>
            <p className="text-xl lg:text-2xl text-navy-200 max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Service Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Britium Ventures offers a comprehensive suite of integrated services designed to streamline your supply chain operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getServiceColor(service.category)} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    {getServiceIcon(service.icon)}
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary" className={getBadgeColor(service.category)}>
                    {service.category === 'domestic' ? 'Domestic Service' : 
                     service.category === 'ecommerce' ? 'E-Commerce Service' : 
                     service.category === 'international' ? 'International Service' : 'Service'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Domestic Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Domestic Delivery Rates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing for deliveries within Myanmar's major cities.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-navy-900 text-white">
              <h3 className="text-2xl font-bold mb-2">Yangon City Zones</h3>
              <p className="text-navy-200">Base rates for first 1kg. Additional weight: +500 MMK/kg</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 border-b pb-2">Zone 1 - Downtown (3,000 MMK)</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {getDomesticPricing()
                      .filter(p => p.price_per_kg === 3000)
                      .slice(0, 8)
                      .map((area, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{area.destination}</span>
                          <span className="font-medium">{area.price_per_kg.toLocaleString()} {area.currency}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 border-b pb-2">Zone 2 - Outer City (3,500 MMK)</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {getDomesticPricing()
                      .filter(p => p.price_per_kg === 3500)
                      .map((area, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{area.destination}</span>
                          <span className="font-medium">{area.price_per_kg.toLocaleString()} {area.currency}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 border-b pb-2">Zone 3 - Periphery (4,500 MMK)</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {getDomesticPricing()
                      .filter(p => p.price_per_kg === 4500)
                      .map((area, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{area.destination}</span>
                          <span className="font-medium">{area.price_per_kg.toLocaleString()} {area.currency}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Other Major Cities</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {getDomesticPricing()
                    .filter(p => p.region !== 'yangon')
                    .map((city, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">{city.destination}</span>
                        <span className="text-lg font-bold text-gold">{city.price_per_kg.toLocaleString()} {city.currency}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">International Air Cargo Rates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Competitive rates for air cargo to major destinations worldwide.
            </p>
          </div>

          <Tabs defaultValue="asia" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="asia">Asia</TabsTrigger>
              <TabsTrigger value="europe">Europe</TabsTrigger>
              <TabsTrigger value="oceania">Oceania</TabsTrigger>
              <TabsTrigger value="north_america">North America</TabsTrigger>
              <TabsTrigger value="middle_east">Middle East</TabsTrigger>
            </TabsList>

            {['asia', 'europe', 'oceania', 'north_america', 'middle_east'].map((region) => (
              <TabsContent key={region} value={region}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-6 h-6 text-gold" />
                      {region.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Air Cargo Pricing (MMK / KG)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Destination</th>
                            <th className="text-left py-3 px-4">Weight Range (kg)</th>
                            <th className="text-left py-3 px-4">Price per KG</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPricingByRegion(region).map((rate, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{rate.destination}</td>
                              <td className="py-3 px-4">{rate.weight_min}-{rate.weight_max} kg</td>
                              <td className="py-3 px-4 font-bold text-gold">
                                {rate.price_per_kg.toLocaleString()} {rate.currency}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      *Rates are subject to change based on fuel surcharges and capacity availability.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-navy-900">
              <Link to={ROUTE_PATHS.CONTACT}>
                Get Custom Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-specific services tailored to meet unique requirements across various sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Container className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Container Services</h3>
                <p className="text-sm text-gray-600">Full container load (FCL) and less than container load (LCL) services</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Bulk Cargo</h3>
                <p className="text-sm text-gray-600">Specialized handling for bulk commodities and oversized cargo</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Secure Transport</h3>
                <p className="text-sm text-gray-600">High-value and sensitive cargo with enhanced security measures</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Time-Critical</h3>
                <p className="text-sm text-gray-600">Express and time-sensitive delivery solutions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Britium Ventures?</h2>
            <p className="text-xl text-navy-200 max-w-3xl mx-auto">
              Our commitment to excellence, combined with deep industry expertise, makes us the preferred logistics partner for businesses across Myanmar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">15+ Years Experience</h3>
              <p className="text-navy-200">
                Proven track record in handling complex logistics challenges across diverse industries.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Network</h3>
              <p className="text-navy-200">
                Extensive partnerships and networks spanning over 50 countries worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Full Compliance</h3>
              <p className="text-navy-200">
                Licensed and certified operations ensuring full regulatory compliance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Team</h3>
              <p className="text-navy-200">
                Skilled professionals dedicated to delivering exceptional service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Optimize Your Supply Chain?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact our logistics experts today to discuss your specific requirements and discover how we can help streamline your operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-navy-900">
              <Link to={ROUTE_PATHS.CONTACT}>
                Get Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white">
              <a href="tel:+95989747744">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}