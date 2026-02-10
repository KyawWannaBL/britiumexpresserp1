import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Clock,
  Save,
  Trash2,
  RefreshCw,
  History,
  ShieldCheck,
  Server,
  Cloud,
  HardDrive,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageContext } from '@/lib/LanguageContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const BackupPage: React.FC = () => {
  const { t } = useLanguageContext();
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Mock data for backup history
  const [backupHistory] = useState([
    { id: 'BK-2026-001', date: '2026-02-03 14:30:00', size: '245 MB', type: 'Scheduled', status: 'Success' },
    { id: 'BK-2026-002', date: '2026-02-02 14:30:00', size: '242 MB', type: 'Scheduled', status: 'Success' },
    { id: 'BK-2026-003', date: '2026-02-01 10:15:00', size: '240 MB', type: 'Manual', status: 'Success' },
    { id: 'BK-2026-004', date: '2026-01-31 14:30:00', size: '0 MB', type: 'Scheduled', status: 'Failed' },
    { id: 'BK-2026-005', date: '2026-01-30 14:30:00', size: '238 MB', type: 'Scheduled', status: 'Success' },
  ]);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      toast({
        title: "Backup Successful",
        description: "The system backup has been completed and stored safely.",
      });
    }, 2000);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your backup configurations have been updated.",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6 pb-20">
      <motion.div 
        initial={fadeInUp.initial as any} 
        animate={fadeInUp.animate as any} 
        transition={springPresets.gentle}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-gold-400 font-myanmar">
            {t('settings.backup')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your database snapshots, schedules, and disaster recovery options.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-gold-400/50 text-navy-900 dark:text-gold-400 hover:bg-gold-500/10"
          >
            <Upload className="mr-2 h-4 w-4" />
            Restore Backup
          </Button>
          <Button 
            className="luxury-button"
            onClick={handleManualBackup}
            disabled={isBackingUp}
          >
            {isBackingUp ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            {isBackingUp ? "Backing Up..." : "Backup Now"}
          </Button>
        </div>
      </motion.div>

      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Configuration Section */}
        <motion.div variants={staggerItem} className="lg:col-span-2 space-y-8">
          <Card className="lotus-card border-none shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gold-500/20 text-gold-500">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-gold-400">{t('broadcast.scheduledMessages')}</CardTitle>
              </div>
              <CardDescription className="text-navy-100/70">
                Configure automated backups to ensure data safety without manual intervention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-800/50 border border-gold-400/20">
                <div className="space-y-0.5">
                  <Label className="text-gold-200 text-base">Enable Auto-Backup</Label>
                  <p className="text-sm text-navy-200">Turn on scheduled backups for the entire database.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gold-300">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="bg-navy-800 border-navy-700 text-gold-100">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-900 border-navy-700 text-gold-100">
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gold-300">Preferred Time</Label>
                  <Input 
                    type="time" 
                    defaultValue="02:30" 
                    className="bg-navy-800 border-navy-700 text-gold-100 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gold-300">Retention Policy</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-navy-800 border-navy-700 text-gold-100">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-900 border-navy-700 text-gold-100">
                    <SelectItem value="7">Keep for 7 days</SelectItem>
                    <SelectItem value="30">Keep for 30 days</SelectItem>
                    <SelectItem value="90">Keep for 90 days</SelectItem>
                    <SelectItem value="365">Keep for 1 year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-navy-300 italic">
                  Older backups will be automatically purged to save storage space.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gold-400/10 pt-6">
              <Button className="luxury-button ml-auto" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </Button>
            </CardFooter>
          </Card>

          {/* History Section */}
          <Card className="lotus-card border-none shadow-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gold-500/20 text-gold-500">
                  <History className="h-5 w-5" />
                </div>
                <CardTitle className="text-gold-400">Backup Log</CardTitle>
              </div>
              <CardDescription className="text-navy-100/70">
                Detailed record of all recent backup operations and their results.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-navy-950/50">
                    <TableRow className="hover:bg-transparent border-gold-400/10">
                      <TableHead className="text-gold-500">Backup ID</TableHead>
                      <TableHead className="text-gold-500">Date & Time</TableHead>
                      <TableHead className="text-gold-500">Size</TableHead>
                      <TableHead className="text-gold-500">Type</TableHead>
                      <TableHead className="text-gold-500">{t('common.status')}</TableHead>
                      <TableHead className="text-gold-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id} className="border-gold-400/10 hover:bg-navy-800/30">
                        <TableCell className="font-mono text-xs text-gold-200">{backup.id}</TableCell>
                        <TableCell className="text-navy-100">{backup.date}</TableCell>
                        <TableCell className="text-navy-100">{backup.size}</TableCell>
                        <TableCell className="text-navy-100">{backup.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={backup.status === 'Success' ? 'default' : 'destructive'}
                            className={backup.status === 'Success' ? 'bg-success/20 text-success border-success/30' : ''}
                          >
                            {backup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gold-400 hover:text-gold-300">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div variants={staggerItem} className="space-y-8">
          <Card className="lotus-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-gold-400 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-200">Last Full Backup:</span>
                <span className="text-gold-100 font-semibold">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-200">Backup Integrity:</span>
                <span className="text-success flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-200">Database Size:</span>
                <span className="text-gold-100 font-semibold">1.24 GB</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-200">Total Backups:</span>
                <span className="text-gold-100 font-semibold">42 files</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lotus-card border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-gold-400">Storage Destination</CardTitle>
              <CardDescription className="text-navy-100/70">
                Select where your backup files are securely stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-gold-500/10 border border-gold-500/30">
                  <Cloud className="h-6 w-6 text-gold-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gold-100">Amazon S3 (Primary)</p>
                    <p className="text-xs text-navy-300">us-east-1 region</p>
                  </div>
                  <Badge className="bg-success/20 text-success">Active</Badge>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/50 border border-navy-700 grayscale opacity-60">
                  <Server className="h-6 w-6 text-navy-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-200">Google Cloud</p>
                    <p className="text-xs text-navy-400">Not configured</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-navy-800/50 border border-navy-700 grayscale opacity-60">
                  <HardDrive className="h-6 w-6 text-navy-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-200">Local Server</p>
                    <p className="text-xs text-navy-400">Disabled</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-gold-500 p-0 hover:text-gold-400">
                Manage Cloud Integrations →
              </Button>
            </CardFooter>
          </Card>

          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-destructive">Critical Alert</p>
                <p className="text-xs text-navy-800 dark:text-navy-200">
                  Storage space is reaching 90% capacity. Please adjust your retention policy or upgrade your S3 bucket plan.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <footer className="pt-10 border-t border-gold-400/10 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Britium Express. All system backups are encrypted with AES-256 for maximum security.
        </p>
      </footer>
    </div>
  );
};

export default BackupPage;