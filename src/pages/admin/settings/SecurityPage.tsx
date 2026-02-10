import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  UserCheck,
  AlertTriangle,
  Save,
  RefreshCw,
  ShieldCheck,
  Fingerprint,
  History,
  Globe,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguageContext } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/translations';
import { ROUTE_PATHS } from '@/lib/index';
import { motion } from 'framer-motion';

const SecurityPage: React.FC = () => {
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('common.success'),
        description: "Security settings have been updated successfully.",
      });
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-8 bg-background">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary myanmar-text">
            {t('settings.security')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your system's security policies, access controls, and encryption settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('common.reset')}
          </Button>
          <Button className="luxury-button gap-2" onClick={handleSaveSettings} disabled={isLoading}>
            <Save className="h-4 w-4" />
            {isLoading ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </header>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Shield className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Activity className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lotus-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-gold-500" />
                  Password Strength Policy
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Define minimum requirements for user passwords.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 Characters (Standard)</SelectItem>
                      <SelectItem value="12">12 Characters (Strong)</SelectItem>
                      <SelectItem value="16">16 Characters (Maximum Security)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="bg-gold-400/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Uppercase Letters</Label>
                    <p className="text-sm text-muted-foreground">At least one A-Z character</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">At least one 0-9 character</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">At least one symbol (!@#$%...)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="lotus-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gold-500" />
                  Password Lifecycle
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Manage password rotation and reuse policies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Expiry (Days)</Label>
                  <Input type="number" defaultValue="90" placeholder="e.g. 90" />
                  <p className="text-xs text-muted-foreground">Set to 0 for no expiration</p>
                </div>
                <div className="space-y-2">
                  <Label>Password History Retention</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No history (Not Recommended)</SelectItem>
                      <SelectItem value="3">Last 3 passwords</SelectItem>
                      <SelectItem value="5">Last 5 passwords</SelectItem>
                      <SelectItem value="10">Last 10 passwords</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Prevent users from reusing recent passwords</p>
                </div>
                <Separator className="bg-gold-400/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enforce Password Change on First Login</Label>
                    <p className="text-sm text-muted-foreground">Mandatory for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-6 animate-fade-in-up">
          <Card className="lotus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-gold-500" />
                Multi-Factor Authentication (MFA)
              </CardTitle>
              <CardDescription className="text-gold-200/70">
                Configure two-step verification for enhanced account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Enforce MFA for Admin Accounts</Label>
                  <p className="text-sm text-muted-foreground">Requires all administrative staff to use authenticator apps.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-gold-400/20" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label>Allowed MFA Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <span>Authenticator App (TOTP)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch />
                      <span className="text-muted-foreground">SMS Verification (Legacy)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked />
                      <span>Email Verification Code</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>MFA Grace Period</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (Enforce immediately)</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Time given to users to set up MFA after policy change.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lotus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold-500" />
                Session Management
              </CardTitle>
              <CardDescription className="text-gold-200/70">
                Control user session lifetime and concurrent access.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Inactivity Timeout (Minutes)</Label>
                <Input type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">Automatic logout after inactivity.</p>
              </div>
              <div className="space-y-2">
                <Label>Maximum Concurrent Sessions</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single Session Only</SelectItem>
                    <SelectItem value="3">Up to 3 devices</SelectItem>
                    <SelectItem value="5">Up to 5 devices</SelectItem>
                    <SelectItem value="0">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lotus-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gold-500" />
                  IP Access Control
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Restrict administrative access to specific IP ranges or locations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Only allow access from these IP addresses.</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Whitelisted IP Addresses / Ranges</Label>
                  <textarea 
                    className="w-full h-32 bg-navy-950/50 border border-gold-400/30 rounded-lg p-3 text-sm font-mono text-gold-100 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    placeholder="192.168.1.1&#10;10.0.0.0/24"
                  />
                  <p className="text-xs text-muted-foreground">Enter one IP address or CIDR range per line.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lotus-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Intrusion Prevention
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Configure automatic lockout policies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" defaultValue="5" />
                  <p className="text-xs text-muted-foreground">Attempts before account is locked.</p>
                </div>
                <div className="space-y-2">
                  <Label>Lockout Duration (Minutes)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <Separator className="bg-gold-400/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Bot Detection</Label>
                    <p className="text-xs text-muted-foreground">Enable CAPTCHA after 3 failures.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 animate-fade-in-up">
          <Card className="lotus-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gold-500" />
                  Security Event Logging
                </CardTitle>
                <CardDescription className="text-gold-200/70">
                  Review recent security-related actions across the system.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-gold-400/30 text-gold-400">
                Download Full Audit Log
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[ 
                  { event: 'Admin Login', user: 'system.admin@britium.com', ip: '192.168.1.45', status: 'Success', time: '2 mins ago' },
                  { event: 'Password Policy Change', user: 'super.user@britium.com', ip: '103.124.56.2', status: 'Updated', time: '1 hour ago' },
                  { event: 'Failed Login Attempt', user: 'unknown@user.com', ip: '45.12.98.122', status: 'Warning', time: '3 hours ago' },
                  { event: 'MFA Disabled', user: 'test.rider@britium.com', ip: '192.168.1.12', status: 'Security Risk', time: '5 hours ago' }
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-navy-950/30 border border-gold-400/10 hover:border-gold-400/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${log.status === 'Warning' || log.status === 'Security Risk' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{log.event}</p>
                        <p className="text-xs text-muted-foreground">{log.user} • {log.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`mb-1 ${log.status === 'Warning' || log.status === 'Security Risk' ? 'border-destructive text-destructive' : 'border-gold-500 text-gold-500'}`}>
                        {log.status}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground uppercase">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t border-gold-400/10 mt-4 pt-4">
              <Button variant="link" className="text-gold-400">
                View All Audit Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;