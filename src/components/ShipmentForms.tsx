import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Package,
  User,
  Phone,
  MapPin,
  Truck,
  PoundSterling,
  Info,
  Save,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Shipment, SHIPMENT_STATUSES } from '@/lib/index';
import { mockBranches } from '@/data/index';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const shipmentSchema = z.object({
  senderName: z.string().min(2, 'Sender name is required'),
  senderPhone: z.string().min(10, 'Valid phone number required'),
  senderAddress: z.string().min(5, 'Detailed address is required'),
  senderCity: z.string().min(2, 'City is required'),
  receiverName: z.string().min(2, 'Receiver name is required'),
  receiverPhone: z.string().min(10, 'Valid phone number required'),
  receiverAddress: z.string().min(5, 'Detailed address is required'),
  receiverCity: z.string().min(2, 'City is required'),
  weight: z.coerce.number().min(0.1, 'Minimum weight is 0.1kg'),
  price: z.coerce.number().min(0, 'Invalid price'),
  codAmount: z.coerce.number().min(0, 'Invalid COD amount').default(0),
  branchId: z.string().min(1, 'Please select a processing branch'),
  notes: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

interface CreateShipmentFormProps {
  onSubmit: (data: ShipmentFormValues) => void;
}

export function CreateShipmentForm({ onSubmit }: CreateShipmentFormProps) {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      senderCity: '',
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      receiverCity: '',
      weight: 1.0,
      price: 0,
      codAmount: 0,
      branchId: '',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Details */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <User size={18} />
                </div>
                Sender Information
              </CardTitle>
              <CardDescription>Origin details for the shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="+44 ..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senderCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="London" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Lane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Receiver Details */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg text-accent-foreground">
                  <MapPin size={18} />
                </div>
                Receiver Information
              </CardTitle>
              <CardDescription>Destination details for the shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="+44 ..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receiverCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Manchester" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="456 Road" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipment Details */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Package size={18} />
              </div>
              Shipment Specifications
            </CardTitle>
            <CardDescription>Weight, pricing, and branch assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Fee (£)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="number" step="0.01" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COD Amount (£)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="number" step="0.01" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Branch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBranches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions / Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any special handling instructions or notes for the rider..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Clear Form
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground">
            <Package className="mr-2 h-4 w-4" />
            Create Shipment
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface EditShipmentFormProps {
  initialData: Shipment;
  onSubmit: (data: ShipmentFormValues) => void;
}

export function EditShipmentForm({ initialData, onSubmit }: EditShipmentFormProps) {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderName: initialData.senderName,
      senderPhone: initialData.senderPhone,
      senderAddress: initialData.senderAddress,
      senderCity: initialData.senderCity,
      receiverName: initialData.receiverName,
      receiverPhone: initialData.receiverPhone,
      receiverAddress: initialData.receiverAddress,
      receiverCity: initialData.receiverCity,
      weight: initialData.weight,
      price: initialData.price,
      codAmount: initialData.codAmount,
      branchId: initialData.branchId,
      notes: initialData.notes || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary p-2 rounded-full">
              <Info size={20} />
            </div>
            <div>
              <p className="font-medium text-foreground">Editing Shipment</p>
              <p className="text-xs text-muted-foreground font-mono">{initialData.trackingNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground uppercase tracking-wider">
              {initialData.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Sender & Origin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Receiver & Destination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="receiverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiverAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Logistics & Financials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee (£)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COD (£)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Update Shipment Details
          </Button>
        </div>
      </form>
    </Form>
  );
}
