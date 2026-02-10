import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Monitor, 
  Globe, 
  Clock, 
  Layout, 
  Save, 
  RefreshCw, 
  Eye,
  Languages
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const UserPreferencesPage: React.FC = () => {
  const { language, setLanguage } = useLanguageContext();
  const { t } = useTranslation(language);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900">
              {t('settings.userPreferences')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize your individual interface and operational behavior
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gold-500/30 text-navy-800 hover:bg-gold-50">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('common.reset')}
            </Button>
            <Button className="luxury-button">
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="interface" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px] bg-navy-50 border border-navy-200">
            <TabsTrigger value="interface" className="data-[state=active]:bg-white data-[state=active]:text-navy-900">
              <Layout className="mr-2 h-4 w-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="localization" className="data-[state=active]:bg-white data-[state=active]:text-navy-900">
              <Globe className="mr-2 h-4 w-4" />
              Regional
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="data-[state=active]:bg-white data-[state=active]:text-navy-900">
              <Eye className="mr-2 h-4 w-4" />
              View
            </TabsTrigger>
          </TabsList>

          {/* Interface Tab */}
          <TabsContent value="interface" className="mt-6">
            <motion.div variants={fadeInUp} className="grid gap-6">
              <Card className="lotus-card border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gold-400">
                    <Monitor className="mr-2 h-5 w-5" />
                    Visual Theme
                  </CardTitle>
                  <CardDescription className="text-navy-200">
                    Choose how Britium Express looks on your device
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Dark Mode</Label>
                      <p className="text-sm text-navy-300">Switch between light and dark visual themes</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-gold-500" />
                  </div>
                  <Separator className="bg-gold-500/20" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Interface Density</Label>
                      <p className="text-sm text-navy-300">Control how much information is visible at once</p>
                    </div>
                    <Select defaultValue="comfortable">
                      <SelectTrigger className="w-[180px] bg-navy-800 border-gold-400/30 text-gold-50">
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-900 border-gold-400/30 text-gold-50">
                        <SelectItem value="compact">Compact (Data Rich)</SelectItem>
                        <SelectItem value="comfortable">Comfortable (Spacious)</SelectItem>
                        <SelectItem value="touch">Touch (Large Targets)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-navy-900">Navigation Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-collapse">Auto-collapse sidebar</Label>
                    <Switch id="auto-collapse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="breadcrumb-nav">Show detailed breadcrumbs</Label>
                    <Switch id="breadcrumb-nav" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sticky-header">Sticky table headers</Label>
                    <Switch id="sticky-header" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Localization Tab */}
          <TabsContent value="localization" className="mt-6">
            <motion.div variants={fadeInUp} className="grid gap-6">
              <Card className="border-gold-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Languages className="mr-2 h-5 w-5 text-gold-600" />
                    Language & Regional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label>System Language</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={language === 'en' ? 'default' : 'outline'}
                        className={language === 'en' ? 'bg-navy-900 text-gold-400' : 'border-navy-200'}
                        onClick={() => setLanguage('en')}
                      >
                        English (US)
                      </Button>
                      <Button 
                        variant={language === 'my' ? 'default' : 'outline'}
                        className={language === 'my' ? 'bg-navy-900 text-gold-400 font-myanmar' : 'border-navy-200 font-myanmar'}
                        onClick={() => setLanguage('my')}
                      >
                        မြန်မာ (Myanmar)
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-navy-500" />
                        Timezone
                      </Label>
                      <Select defaultValue="mmt">
                        <SelectTrigger className="border-navy-200">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mmt">Myanmar Time (GMT+6:30)</SelectItem>
                          <SelectItem value="sgt">Singapore Time (GMT+8:00)</SelectItem>
                          <SelectItem value="utc">UTC / GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select defaultValue="ddmmyyyy">
                        <SelectTrigger className="border-navy-200">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ddmmyyyy">DD/MM/YYYY (31/12/2026)</SelectItem>
                          <SelectItem value="mmddyyyy">MM/DD/YYYY (12/31/2026)</SelectItem>
                          <SelectItem value="yyyymmdd">YYYY-MM-DD (2026-12-31)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Unit Preferences</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Weight Unit</Label>
                    <Select defaultValue="kg">
                      <SelectTrigger className="border-navy-200">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="viss">Viss (Myanmar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency Symbol</Label>
                    <Select defaultValue="mmk">
                      <SelectTrigger className="border-navy-200">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mmk">Myanmar Kyat (Ks)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="thb">Thai Baht (฿)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="mt-6">
            <motion.div variants={fadeInUp} className="grid gap-6">
              <Card className="border-gold-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Accessibility Features</CardTitle>
                  <CardDescription>
                    Enhance your interaction with the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase visibility for text and UI elements</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Screen Reader Support</Label>
                      <p className="text-sm text-muted-foreground">Optimized markup for assistive technology</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the dashboard</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Content Display</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Tooltips on Hover</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Confirmation Dialogs</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Sound Notifications</Label>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div variants={fadeInUp} className="pt-6">
          <Card className="bg-gold-50 border-gold-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gold-500 rounded-full">
                  <User className="h-6 w-6 text-navy-900" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900">Personalization Note</h4>
                  <p className="text-sm text-navy-800">
                    These preferences are specific to your user account and will persist across all devices you use to access the Britium Express platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserPreferencesPage;