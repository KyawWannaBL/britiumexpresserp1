import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackagePlus, ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTE_PATHS } from '@/lib/index.ts';
import { CreateShipmentForm } from '@/components/ShipmentForms.tsx';
import { toast } from 'sonner';
import { springPresets, fadeInUp } from '@/lib/motion';

/**
 * CreateShipment Page
 * 
 * Provides a comprehensive interface for logistics operators and merchants
 * to register new packages into the Britium Express system.
 */
export default function CreateShipment() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    // In a real application, this would be an API call to Supabase or a backend
    console.log('Shipment Data Submitted:', data);
    
    // Simulate API delay
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));

    toast.promise(promise, {
      loading: 'Registering shipment...',
      success: () => {
        navigate(ROUTE_PATHS.SHIPMENTS);
        return 'Shipment created successfully! Tracking ID generated.';
      },
      error: 'Failed to create shipment. Please try again.',
    });
  };

  return (
    <motion.div 
      className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={springPresets.gentle}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 -ml-2 hover:bg-secondary"
              onClick={() => navigate(ROUTE_PATHS.SHIPMENTS)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Shipments
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <PackagePlus className="w-8 h-8 text-primary" />
            New Shipment
          </h1>
          <p className="text-muted-foreground">
            Register a new package for delivery within the Britium Express network.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
              <CardDescription>
                Enter sender, receiver, and package specifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateShipmentForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Info className="w-5 h-5" />
                Quick Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-foreground/80">
              <p>
                Ensure all recipient contact information is accurate to avoid delivery delays.
              </p>
              <div className="p-3 bg-background rounded-md border border-border space-y-2">
                <h4 className="font-semibold text-foreground">Prohibited Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                  <li>Flammable liquids or gases</li>
                  <li>Illegal substances</li>
                  <li>Perishable goods (without cold chain)</li>
                  <li>Unsecured sharp objects</li>
                </ul>
              </div>
              <p className="text-xs italic">
                By creating this shipment, you agree to Britium Express Logistics Terms of Service (v2026.1).
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Bulk Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Need to create multiple shipments? Upload a CSV or Excel file to process in batch.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Upload Manifest (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
