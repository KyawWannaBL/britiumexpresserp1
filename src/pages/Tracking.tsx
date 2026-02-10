import React, { useState } from 'react';
import { Search, Package, MapPin, AlertCircle, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '@/assets/images';
import { mockShipments } from '@/data/index';
import { Shipment } from '@/lib/index';
import { TrackingTimeline, TrackingCard, StatusBadge } from '@/components/TrackingComponents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState<Shipment | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setIsSearched(false);

    // Simulate network delay for realism
    setTimeout(() => {
      const shipment = mockShipments.find(
        (s) => s.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()
      );
      setSearchResult(shipment || null);
      setIsSearched(true);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.DELIVERY_RIDER_1}
            alt="Delivery Rider"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Track Your <span className="text-primary">Shipment</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Enter your Britium Express tracking number below to see real-time status updates for your package.
            </p>

            <form onSubmit={handleSearch} className="relative flex gap-2 p-2 bg-card rounded-2xl shadow-2xl border border-border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="BRX-2026-XXXX"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-12 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-mono"
                />
              </div>
              <Button type="submit" size="lg" disabled={isLoading} className="h-14 px-8 rounded-xl">
                {isLoading ? 'Searching...' : 'Track'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {isSearched && searchResult ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Tracking Details */}
              <div className="lg:col-span-2 space-y-8">
                <TrackingCard shipment={searchResult} />
                
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Journey Timeline
                    </CardTitle>
                    <CardDescription>Detailed history of your shipment movements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrackingTimeline shipment={searchResult} />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="border-none shadow-md bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Package Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{searchResult.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Type</span>
                      <span className="font-medium">Standard Express</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className="font-medium capitalize">{searchResult.paymentStatus}</span>
                    </div>
                    {searchResult.codAmount > 0 && (
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">COD Amount</span>
                        <span className="font-bold text-accent">£{searchResult.codAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Origin</p>
                      <p className="font-medium">{searchResult.senderCity}</p>
                    </div>
                    <div className="h-8 border-l-2 border-dashed border-muted ml-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Destination</p>
                      <p className="font-medium">{searchResult.receiverCity}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : isSearched && !searchResult ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto text-center py-20"
            >
              <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Shipment Not Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any shipment with tracking number "{trackingNumber}". 
                Please double-check the code and try again.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[ 
                { icon: Package, title: 'Safe Handling', desc: 'Every package is handled with precision and care.' },
                { icon: Truck, title: 'Fast Delivery', desc: 'Our logistics network ensures optimal routing for speed.' },
                { icon: CheckCircle2, title: 'Real-time Tracking', desc: 'Monitor your delivery at every stage of the journey.' }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-sm"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Help Footer */}
      <footer className="bg-secondary/50 py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Need help with your delivery?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">FAQs</Button>
            <Button variant="outline">Our Locations</Button>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            © 2026 Britium Express Logistics System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
