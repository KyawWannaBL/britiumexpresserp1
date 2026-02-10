import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Building2,
  Globe,
  Settings2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Upload,
  Globe2,
  Clock,
  Coins
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const GeneralSettingsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(t('common.success'), {
        description: 'Settings updated successfully.',
      });
    }, 1500);
  };

  return (
    <div className="w-full space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400">
            {t('settings.general')}
          </h1>
          <p className="text-muted-foreground">
            Manage your company information and system-wide preferences
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="luxury-button"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:w-auto md:grid-cols-3 bg-navy-50 dark:bg-navy-900 border border-gold-400/20 p-1">
          <TabsTrigger value="company" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900">
            <Building2 className="mr-2 h-4 w-4" />
            Company Info
          </TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900">
            <Settings2 className="mr-2 h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900">
            <Globe className="mr-2 h-4 w-4" />
            Localization
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6"
          >
            <Card className="lotus-card border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-navy-200/70">
                  Publicly visible information about Britium Express
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gold-200">Company Name</Label>
                    <Input id="companyName" defaultValue="Britium Express Logistics" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNo" className="text-gold-200">Registration Number</Label>
                    <Input id="registrationNo" defaultValue="BE-2026-9988" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gold-200">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gold-500/50" />
                      <Input id="email" className="pl-10 bg-navy-950/50 border-gold-400/20 text-white" defaultValue="info@britiumexpress.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gold-200">Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gold-500/50" />
                      <Input id="phone" className="pl-10 bg-navy-950/50 border-gold-400/20 text-white" defaultValue="+95 9 123 456 789" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gold-200">Headquarters Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gold-500/50" />
                    <Input id="address" className="pl-10 bg-navy-950/50 border-gold-400/20 text-white" defaultValue="No. 123, Merchant Street, Yangon, Myanmar" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lotus-card border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Brand Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-navy-950 border-2 border-dashed border-gold-400/30 flex items-center justify-center overflow-hidden">
                    <img src="/images/britium-logo.png" alt="Logo" className="max-w-[80%]" />
                  </div>
                  <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400 hover:bg-gold-400/10">
                    <Upload className="mr-2 h-3 w-3" />
                    Change Logo
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gold-200">Favicon</Label>
                    <p className="text-xs text-muted-foreground">Upload a 32x32px or 64x64px ICO/PNG file</p>
                    <Input type="file" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">System Title</Label>
                    <Input defaultValue="Britium Express | Admin Portal" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6"
          >
            <Card className="lotus-card border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">System Operational Rules</CardTitle>
                <CardDescription className="text-navy-200/70">Configure how the system behaves globally</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-navy-950/30 border border-gold-400/10">
                  <div className="space-y-0.5">
                    <Label className="text-gold-200">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Restrict system access to only Super Admins during maintenance</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-navy-950/30 border border-gold-400/10">
                  <div className="space-y-0.5">
                    <Label className="text-gold-200">Merchant Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new merchants to register via public website</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-navy-950/30 border border-gold-400/10">
                  <div className="space-y-0.5">
                    <Label className="text-gold-200">Auto-Assign Riders</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign pickups based on proximity and load</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gold-400/10" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gold-200">Default Commission Rate (%)</Label>
                    <Input type="number" defaultValue="10" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gold-200">Max Weight per Parcel (kg)</Label>
                    <Input type="number" defaultValue="30" className="bg-navy-950/50 border-gold-400/20 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6"
          >
            <Card className="lotus-card border-gold-400/30">
              <CardHeader>
                <CardTitle className="text-gold-400">Regional & Regional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gold-200 flex items-center gap-2">
                      <Globe2 className="h-4 w-4" />
                      Default Language
                    </Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-900 border-gold-400/20 text-white">
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="my">Myanmar (Zawgyi/Unicode)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gold-200 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      System Timezone
                    </Label>
                    <Select defaultValue="asia-yangon">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-900 border-gold-400/20 text-white">
                        <SelectItem value="asia-yangon">Asia/Yangon (GMT+6:30)</SelectItem>
                        <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7:00)</SelectItem>
                        <SelectItem value="utc">UTC / GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gold-200 flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Primary Currency
                    </Label>
                    <Select defaultValue="mmk">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-900 border-gold-400/20 text-white">
                        <SelectItem value="mmk">Myanmar Kyat (MMK)</SelectItem>
                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                        <SelectItem value="thb">Thai Baht (THB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gold-200">Date Format</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger className="bg-navy-950/50 border-gold-400/20 text-white">
                        <SelectValue placeholder="Select Date Format" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-900 border-gold-400/20 text-white">
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Button for Mobile */}
      <div className="flex md:hidden pt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="luxury-button w-full h-12"
        >
          <Save className="mr-2 h-5 w-5" />
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;