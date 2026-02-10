import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Package, 
  Truck, 
  MapPin, 
  AlertCircle, 
  XCircle, 
  RotateCcw, 
  Warehouse, 
  FileText,
  Clock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Shipment, 
  ShipmentStatus, 
  SHIPMENT_STATUSES 
} from '@/lib/index';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const config: Record<ShipmentStatus, { label: string; className: string }> = {
    [SHIPMENT_STATUSES.PENDING]: { 
      label: 'Pending', 
      className: 'bg-secondary text-secondary-foreground' 
    },
    [SHIPMENT_STATUSES.PICKED_UP]: { 
      label: 'Picked Up', 
      className: 'bg-primary/20 text-primary border-primary/30' 
    },
    [SHIPMENT_STATUSES.IN_TRANSIT]: { 
      label: 'In Transit', 
      className: 'bg-accent/20 text-accent-foreground border-accent/30' 
    },
    [SHIPMENT_STATUSES.ARRIVED_AT_WAREHOUSE]: { 
      label: 'At Warehouse', 
      className: 'bg-primary/10 text-primary border-primary/20' 
    },
    [SHIPMENT_STATUSES.OUT_FOR_DELIVERY]: { 
      label: 'Out for Delivery', 
      className: 'bg-accent text-accent-foreground' 
    },
    [SHIPMENT_STATUSES.DELIVERED]: { 
      label: 'Delivered', 
      className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
    },
    [SHIPMENT_STATUSES.FAILED]: { 
      label: 'Failed', 
      className: 'bg-destructive/20 text-destructive border-destructive/30' 
    },
    [SHIPMENT_STATUSES.CANCELLED]: { 
      label: 'Cancelled', 
      className: 'bg-muted text-muted-foreground' 
    },
    [SHIPMENT_STATUSES.RETURNED]: { 
      label: 'Returned', 
      className: 'bg-amber-500/20 text-amber-600 border-amber-500/30' 
    },
  };

  const { label, className } = config[status] || config[SHIPMENT_STATUSES.PENDING];

  return (
    <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium uppercase tracking-wider text-[10px]", className)}>
      {label}
    </Badge>
  );
}

export function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const history = [...shipment.trackingHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case SHIPMENT_STATUSES.PENDING: return FileText;
      case SHIPMENT_STATUSES.PICKED_UP: return Package;
      case SHIPMENT_STATUSES.IN_TRANSIT: return Truck;
      case SHIPMENT_STATUSES.ARRIVED_AT_WAREHOUSE: return Warehouse;
      case SHIPMENT_STATUSES.OUT_FOR_DELIVERY: return MapPin;
      case SHIPMENT_STATUSES.DELIVERED: return CheckCircle2;
      case SHIPMENT_STATUSES.FAILED: return AlertCircle;
      case SHIPMENT_STATUSES.CANCELLED: return XCircle;
      case SHIPMENT_STATUSES.RETURNED: return RotateCcw;
      default: return Circle;
    }
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
      {history.map((event, index) => {
        const Icon = getStatusIcon(event.status);
        const isLast = index === 0;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start group"
          >
            <div className={cn(
              "absolute left-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-background transition-colors duration-200",
              isLast ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
              {isLast && (
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/40 -z-10" />
              )}
            </div>
            <div className="ml-14 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                <time className="text-xs font-mono font-medium text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
                <span className="hidden sm:block text-muted-foreground/30">•</span>
                <span className="text-sm font-semibold text-foreground">
                  {event.location}
                </span>
              </div>
              <h4 className={cn(
                "text-base font-medium mb-1",
                isLast ? "text-foreground" : "text-muted-foreground"
              )}>
                {event.description}
              </h4>
              <p className="text-sm text-muted-foreground">
                Updated by {event.updatedBy}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TrackingCard({ shipment }: { shipment: Shipment }) {
  return (
    <Card className="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/70">Tracking Number</p>
            <CardTitle className="text-2xl font-mono font-bold tracking-tight">
              {shipment.trackingNumber}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={shipment.status} />
            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground font-medium uppercase">Last Updated</p>
              <p className="text-sm font-semibold">{new Date(shipment.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Shipment Journey</h3>
            </div>
            <TrackingTimeline shipment={shipment} />
          </div>

          <div className="space-y-8">
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Package Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Weight</p>
                  <p className="font-semibold">{shipment.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service Type</p>
                  <p className="font-semibold">Standard Express</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">COD Amount</p>
                  <p className="font-semibold">${shipment.codAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment</p>
                  <Badge variant={shipment.paymentStatus === 'paid' ? 'default' : 'outline'} className="text-[10px]">
                    {shipment.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">From</p>
                  <p className="font-semibold text-foreground">{shipment.senderName}</p>
                  <p className="text-sm text-muted-foreground">{shipment.senderAddress}, {shipment.senderCity}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 p-2 rounded-full bg-accent/10 text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">To</p>
                  <p className="font-semibold text-foreground">{shipment.receiverName}</p>
                  <p className="text-sm text-muted-foreground">{shipment.receiverAddress}, {shipment.receiverCity}</p>
                </div>
              </div>
            </div>

            {shipment.notes && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Notes</p>
                <p className="text-sm italic">"{shipment.notes}"</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
