import React, { useState } from 'react';
import {
  Key,
  Webhook,
  Activity,
  ShieldCheck,
  Plus,
  Copy,
  Trash2,
  RefreshCw,
  Facebook,
  Link2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Shield,
  Globe,
  Code,
  Lock
} from 'lucide-react';
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { SiViber } from 'react-icons/si';

const ApiSettingsPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('keys');

  // Mock Data for API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Main Dashboard Web', key: 'brt_live_********************', status: 'active', created: '2026-01-15' },
    { id: '2', name: 'Mobile Rider App', key: 'brt_live_********************', status: 'active', created: '2026-01-20' },
    { id: '3', name: 'Merchant Portal Dev', key: 'brt_test_********************', status: 'revoked', created: '2025-12-10' }
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: language === 'my' ? 'ကော်ပီကူးယူပြီးပါပြီ' : 'Copied to clipboard',
      description: language === 'my' ? 'API Key ကို အောင်မြင်စွာ ကူးယူပြီးပါပြီ။' : 'API Key successfully copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 myanmar-text">
            {t('settings.apiSettings')}
          </h1>
          <p className="text-muted-foreground mt-1 myanmar-text">
            {language === 'my' 
              ? 'စနစ်ချိတ်ဆက်မှုများ၊ API ကီးများနှင့် ဝဘ်ဟွတ်ခ်များကို စီမံခန့်ခွဲပါ။' 
              : 'Manage system integrations, API keys, and external webhook configurations.'}
          </p>
        </div>
        <Button className="luxury-button myanmar-text">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'my' ? 'API ကီးအသစ်ဖန်တီးရန်' : 'Create New API Key'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-navy-100/50 dark:bg-navy-900/50 p-1 border border-navy-200/50 dark:border-navy-700/50">
          <TabsTrigger value="keys" className="myanmar-text">
            <Key className="w-4 h-4 mr-2" />
            {language === 'my' ? 'API ကီးများ' : 'API Keys'}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="myanmar-text">
            <Webhook className="w-4 h-4 mr-2" />
            {language === 'my' ? 'ဝဘ်ဟွတ်ခ်များ' : 'Webhooks'}
          </TabsTrigger>
          <TabsTrigger value="limits" className="myanmar-text">
            <Activity className="w-4 h-4 mr-2" />
            {language === 'my' ? 'ကန့်သတ်ချက်များ' : 'Rate Limits'}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="myanmar-text">
            <Link2 className="w-4 h-4 mr-2" />
            {t('settings.integrations')}
          </TabsTrigger>
        </TabsList>

        {/* API Keys Content */}
        <TabsContent value="keys" className="space-y-4">
          <Card className="lotus-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold-500">
                <ShieldCheck className="w-5 h-5" />
                {language === 'my' ? 'အသုံးပြုနေသော API ကီးများ' : 'Active API Credentials'}
              </CardTitle>
              <CardDescription className="text-navy-200">
                {language === 'my' 
                  ? 'သင့်လုပ်ငန်းသုံး ဆော့ဖ်ဝဲလ်များနှင့် ချိတ်ဆက်ရန် ဤကီးများကို အသုံးပြုပါ။' 
                  : 'Use these keys to authenticate your external applications with the Britium Express API.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-gold-400/20 overflow-hidden">
                <Table>
                  <TableHeader className="bg-navy-800/50">
                    <TableRow>
                      <TableHead className="text-gold-400">{language === 'my' ? 'အမည်' : 'Name'}</TableHead>
                      <TableHead className="text-gold-400">{language === 'my' ? 'ကီး (Key)' : 'API Key'}</TableHead>
                      <TableHead className="text-gold-400">{language === 'my' ? 'ရက်စွဲ' : 'Created'}</TableHead>
                      <TableHead className="text-gold-400">{language === 'my' ? 'အခြေအနေ' : 'Status'}</TableHead>
                      <TableHead className="text-right text-gold-400">{language === 'my' ? 'လုပ်ဆောင်ချက်' : 'Action'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id} className="border-gold-400/10 hover:bg-gold-500/5 transition-colors">
                        <TableCell className="font-medium text-white">{key.name}</TableCell>
                        <TableCell className="font-mono text-xs text-navy-200">{key.key}</TableCell>
                        <TableCell className="text-navy-200">{key.created}</TableCell>
                        <TableCell>
                          <Badge variant={key.status === 'active' ? 'outline' : 'destructive'} 
                            className={key.status === 'active' ? 'bg-success/10 text-success border-success/30' : ''}>
                            {key.status === 'active' ? (language === 'my' ? 'အသုံးပြုဆဲ' : 'Active') : (language === 'my' ? 'ရပ်ဆိုင်းထား' : 'Revoked')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/10" onClick={() => handleCopy('brt_live_sample_key_123')}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-navy-200 dark:border-navy-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  {language === 'my' ? 'လုံခြုံရေး အကြံပြုချက်' : 'Security Best Practices'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="mt-1 text-success"><CheckCircle2 className="w-4 h-4" /></div>
                  <p>{language === 'my' ? 'API ကီးများကို လျှို့ဝှက်စွာ ထိန်းသိမ်းပါ။' : 'Never share your API keys in public repositories or client-side code.'}</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 text-success"><CheckCircle2 className="w-4 h-4" /></div>
                  <p>{language === 'my' ? 'အသုံးမပြုတော့သော ကီးများကို ချက်ချင်းဖျက်ပါ။' : 'Revoke unused or compromised keys immediately to prevent unauthorized access.'}</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 text-warning"><AlertCircle className="w-4 h-4" /></div>
                  <p>{language === 'my' ? 'လုံခြုံရေးအတွက် ၆ လတစ်ကြိမ် ကီးအသစ်လဲလှယ်ပါ။' : 'Rotate your keys every 6 months for enhanced system security.'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-navy-200 dark:border-navy-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  {language === 'my' ? 'API စာရွက်စာတမ်းများ' : 'Developer Resources'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === 'my' 
                    ? 'ကျွန်ုပ်တို့၏ API ကို အသုံးပြုပုံအသေးစိတ်ကို စာရွက်စာတမ်းများတွင် ဖတ်ရှုနိုင်ပါသည်။' 
                    : 'Explore our comprehensive API documentation to learn about endpoints, authentication, and SDKs.'}
                </p>
                <Button variant="outline" className="w-full justify-between group">
                  <span>{language === 'my' ? 'API စာရွက်စာတမ်းဖတ်ရန်' : 'View Documentation'}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Webhooks Content */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card className="border border-navy-200 dark:border-navy-800 shadow-xl shadow-navy-900/5">
            <CardHeader>
              <CardTitle className="myanmar-text">{language === 'my' ? 'ဝဘ်ဟွတ်ခ် ဆက်တင်များ' : 'Webhook Configuration'}</CardTitle>
              <CardDescription>
                {language === 'my' 
                  ? 'ပါဆယ်အခြေအနေပြောင်းလဲမှုများကို သင့်ဆာဗာသို့ အချိန်နှင့်တပြေးညီ ပို့ဆောင်ပေးမည်။' 
                  : 'Receive real-time notifications about shipment status changes directly to your server.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">{language === 'my' ? 'လက်ခံမည့် URL' : 'Endpoint URL'}</Label>
                <div className="flex gap-2">
                  <Input id="webhook-url" placeholder="https://yourdomain.com/webhooks/britium" className="bg-muted/50" />
                  <Button variant="outline">{language === 'my' ? 'စမ်းသပ်ရန်' : 'Test Connection'}</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">{language === 'my' ? 'လျှို့ဝှက်ကီး (Signing Secret)' : 'Signing Secret'}</Label>
                <div className="flex gap-2">
                  <Input id="webhook-secret" value="whsec_5f8b9e4a2c1d0f..." readOnly className="bg-muted/50 font-mono" />
                  <Button variant="ghost" size="icon" onClick={() => handleCopy('whsec_5f8b9e4a2c1d0f...')}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'my' 
                    ? 'ဝဘ်ဟွတ်ခ်မှ လာသောဒေတာများ မှန်ကန်ကြောင်း စစ်ဆေးရန် ဤကီးကို သုံးပါ။' 
                    : 'Use this secret to verify that the webhook events were sent by Britium Express.'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base font-semibold">{language === 'my' ? 'အကြောင်းကြားချက်များ' : 'Events to Track'}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['shipment.created', 'shipment.picked_up', 'shipment.in_transit', 'shipment.delivered', 'shipment.failed', 'shipment.returned'].map((event) => (
                    <div key={event} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                      <span className="text-sm font-mono">{event}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t flex justify-end gap-3">
              <Button variant="ghost">{t('common.reset')}</Button>
              <Button className="luxury-button">{t('common.save')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Rate Limits Content */}
        <TabsContent value="limits" className="space-y-6">
          <Card className="border border-navy-200 dark:border-navy-800">
            <CardHeader>
              <CardTitle className="myanmar-text">{language === 'my' ? 'API အသုံးပြုမှု ကန့်သတ်ချက်များ' : 'API Rate Limiting'}</CardTitle>
              <CardDescription>
                {language === 'my' 
                  ? 'စနစ်တည်ငြိမ်မှုအတွက် API ခေါ်ဆိုမှုများကို ကန့်သတ်ထားပါသည်။' 
                  : 'Configure usage thresholds to ensure system stability and fair resource allocation.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-navy-50 dark:bg-navy-900/50 border border-navy-200 dark:border-navy-700 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{language === 'my' ? 'တစ်မိနစ်လျှင် ခေါ်ဆိုမှု' : 'Requests per Minute'}</p>
                  <p className="text-3xl font-bold text-primary">1,200</p>
                </div>
                <div className="p-6 rounded-2xl bg-navy-50 dark:bg-navy-900/50 border border-navy-200 dark:border-navy-700 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{language === 'my' ? 'တစ်ရက်လျှင် စုစုပေါင်း' : 'Daily Quota'}</p>
                  <p className="text-3xl font-bold text-primary">500,000</p>
                </div>
                <div className="p-6 rounded-2xl bg-navy-50 dark:bg-navy-900/50 border border-navy-200 dark:border-navy-700 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{language === 'my' ? 'အပြိုင်ခေါ်ဆိုမှု' : 'Concurrent Connections'}</p>
                  <p className="text-3xl font-bold text-primary">50</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{language === 'my' ? 'ကန့်သတ်ချက်ကျော်လွန်ပါက အကြောင်းကြားရန်' : 'Quota Warning Notifications'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'my' ? 'အသုံးပြုမှု ၈၀ ရာခိုင်နှုန်းကျော်လျှင် အီးမေးလ်ပို့မည်။' : 'Receive an email when you reach 80% of your daily API limit.'}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{language === 'my' ? 'အသုံးပြုမှု မှတ်တမ်း (Audit Logs)' : 'API Audit Logging'}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'my' ? 'API ခေါ်ဆိုမှုတိုင်း၏ အသေးစိတ်မှတ်တမ်းကို ၃၀ ရက် သိမ်းဆည်းမည်။' : 'Keep detailed logs of all API interactions for 30 days.'}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Content */}
        <TabsContent value="integrations" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Facebook Integration */}
          <Card className="border border-navy-200 dark:border-navy-800 hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <Facebook className="w-6 h-6 fill-current" />
              </div>
              <div>
                <CardTitle className="text-lg">Facebook Business</CardTitle>
                <Badge variant="secondary" className="bg-success/10 text-success">{language === 'my' ? 'ချိတ်ဆက်ပြီး' : 'Connected'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'my' 
                  ? 'Facebook Page မှ အော်ဒါများကို အလိုအလျောက် ရယူရန်နှင့် မက်ဆေ့ချ်ပို့ရန်။' 
                  : 'Sync orders from your Facebook Pages and automate responses to customer inquiries.'}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full text-navy-600 dark:text-gold-400 group-hover:bg-gold-500/10">
                {language === 'my' ? 'ဆက်တင်ပြင်ရန်' : 'Manage Settings'}
              </Button>
            </CardFooter>
          </Card>

          {/* Viber Integration */}
          <Card className="border border-navy-200 dark:border-navy-800 hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                <SiViber className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Viber Bot API</CardTitle>
                <Badge variant="secondary" className="bg-success/10 text-success">{language === 'my' ? 'ချိတ်ဆက်ပြီး' : 'Connected'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'my' 
                  ? 'Viber မှတစ်ဆင့် ပါဆယ်ခြေရာခံခြင်းနှင့် အကြောင်းကြားချက်များ ပို့ရန်။' 
                  : 'Enable shipment tracking and automated notifications through the Britium Viber Bot.'}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full text-navy-600 dark:text-gold-400 group-hover:bg-gold-500/10">
                {language === 'my' ? 'ဆက်တင်ပြင်ရန်' : 'Manage Settings'}
              </Button>
            </CardFooter>
          </Card>

          {/* Cloud Storage Integration */}
          <Card className="border border-navy-200 dark:border-navy-800 border-dashed hover:border-gold-500/50 hover:bg-gold-500/5 transition-all cursor-pointer group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{language === 'my' ? 'အခြားပေါင်းစပ်မှုများ' : 'Custom Web App'}</CardTitle>
                <Badge variant="outline">{language === 'my' ? 'မချိတ်ဆက်ရသေး' : 'Not Connected'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'my' 
                  ? 'သင့်လုပ်ငန်းသုံး ဝဘ်ဆိုဒ် သို့မဟုတ် ERP နှင့် တိုက်ရိုက်ချိတ်ဆက်ပါ။' 
                  : 'Connect your own website or internal ERP system using our custom integration toolkit.'}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" className="w-full group-hover:text-gold-600">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'my' ? 'အသစ်ထည့်ရန်' : 'Add Integration'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Help Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 border border-gold-400/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gold-500/20 text-gold-500">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white myanmar-text">
              {language === 'my' ? 'အကူအညီ လိုအပ်ပါသလား?' : 'Need Technical Support?'}
            </h3>
            <p className="text-navy-200 text-sm myanmar-text">
              {language === 'my' 
                ? 'ကျွန်ုပ်တို့၏ developer အဖွဲ့နှင့် တိုက်ရိုက်ဆက်သွယ် မေးမြန်းနိုင်ပါသည်။' 
                : 'Our developer support team is available 24/7 to help with your API implementation.'}
            </p>
          </div>
        </div>
        <Button className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-8">
          {language === 'my' ? 'ဆက်သွယ်ရန်' : 'Contact Dev Support'}
        </Button>
      </div>
    </div>
  );
};

export default ApiSettingsPage;