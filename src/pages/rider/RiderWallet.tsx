import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
  Star,
  Gift,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { RiderAPI, type Rider, type RiderTransaction } from '@/lib/rider-api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

const RiderWallet: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [rider, setRider] = useState<Rider | null>(null);
  const [transactions, setTransactions] = useState<RiderTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Load rider profile
      const riderProfile = await RiderAPI.getRiderProfile();
      if (riderProfile) {
        setRider(riderProfile);
        
        // Load transactions
        const riderTransactions = await RiderAPI.getRiderTransactions(riderProfile.id, 100);
        setTransactions(riderTransactions);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: t('rider.error'),
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (!showBalance) return '****';
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'cod_collection':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'delivery_fee':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'cod_remittance':
        return <ArrowUpRight className="w-4 h-4 text-error" />;
      case 'wallet_withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-error" />;
      case 'bonus':
        return <Gift className="w-4 h-4 text-gold-500" />;
      case 'penalty':
        return <AlertTriangle className="w-4 h-4 text-error" />;
      default:
        return <DollarSign className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'cod_collection':
      case 'delivery_fee':
      case 'bonus':
        return 'text-success';
      case 'cod_remittance':
      case 'wallet_withdrawal':
      case 'penalty':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTransactionAmount = (transaction: RiderTransaction) => {
    const isIncome = ['cod_collection', 'delivery_fee', 'bonus'].includes(transaction.transaction_type);
    const sign = isIncome ? '+' : '-';
    return `${sign}${formatCurrency(Math.abs(transaction.amount))}`;
  };

  const getTodayTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.filter(t => t.created_at.startsWith(today));
  };

  const getThisWeekTransactions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transactions.filter(t => new Date(t.created_at) >= weekAgo);
  };

  const getThisMonthTransactions = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return transactions.filter(t => new Date(t.created_at) >= monthAgo);
  };

  const calculateEarnings = (transactionList: RiderTransaction[]) => {
    return transactionList
      .filter(t => ['delivery_fee', 'bonus'].includes(t.transaction_type))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateCOD = (transactionList: RiderTransaction[]) => {
    const collected = transactionList
      .filter(t => t.transaction_type === 'cod_collection')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remitted = transactionList
      .filter(t => t.transaction_type === 'cod_remittance')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return collected - remitted;
  };

  const todayTransactions = getTodayTransactions();
  const weekTransactions = getThisWeekTransactions();
  const monthTransactions = getThisMonthTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-navy-600">{t('rider.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-br from-navy-50 to-gold-50 pb-20"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy-900">{t('rider.wallet')}</h1>
                <p className="text-sm text-muted-foreground">
                  {rider?.full_name || 'Rider'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadWalletData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
          <Card className="glass-card bg-gradient-to-br from-gold-500/10 to-gold-600/10 border-gold-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-6 h-6 text-gold-500" />
              </div>
              <div className="text-2xl font-bold text-gold-600">
                {formatCurrency(rider?.wallet_balance || 0)}
              </div>
              <div className="text-sm text-muted-foreground">{t('rider.walletBalance')}</div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-gradient-to-br from-success/10 to-success/20 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(rider?.cod_balance || 0)}
              </div>
              <div className="text-sm text-muted-foreground">{t('rider.codBalance')}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Earnings */}
        <motion.div variants={staggerItem}>
          <Card className="glass-card bg-gradient-to-r from-info/10 to-info/20 border-info/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('rider.todayEarnings')}</p>
                  <p className="text-3xl font-bold text-info">
                    {formatCurrency(calculateEarnings(todayTransactions))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayTransactions.length} {t('rider.transactions')}
                  </p>
                </div>
                <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="overview">{t('rider.overview')}</TabsTrigger>
              <TabsTrigger value="transactions">{t('rider.transactions')}</TabsTrigger>
              <TabsTrigger value="actions">{t('rider.actions')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4">
              {/* Period Summary */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('rider.earnings')} {t('rider.summary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-navy-900">
                          {formatCurrency(calculateEarnings(todayTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.today')}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-navy-900">
                          {formatCurrency(calculateEarnings(weekTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.thisWeek')}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-navy-900">
                          {formatCurrency(calculateEarnings(monthTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.thisMonth')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('rider.cod')} {t('rider.summary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-success">
                          {formatCurrency(calculateCOD(todayTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.today')}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-success">
                          {formatCurrency(calculateCOD(weekTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.thisWeek')}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-success">
                          {formatCurrency(calculateCOD(monthTransactions))}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('rider.thisMonth')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6 space-y-4">
              {/* Transaction List */}
              <div className="space-y-3">
                {transactions.slice(0, 20).map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.transaction_type)}
                            <div>
                              <h4 className="font-medium text-navy-900">
                                {t(`rider.${transaction.transaction_type}`) || transaction.transaction_type}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleString(language === 'my' ? 'my-MM' : 'en-MM')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                              {getTransactionAmount(transaction)}
                            </div>
                            <Badge 
                              className={`text-xs ${
                                transaction.status === 'completed' ? 'bg-success/10 text-success' :
                                transaction.status === 'pending' ? 'bg-warning/10 text-warning' :
                                'bg-error/10 text-error'
                              }`}
                            >
                              {t(`rider.${transaction.status}`) || transaction.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {transaction.reference_number && (
                          <div className="mt-2 pt-2 border-t border-muted/20">
                            <p className="text-xs text-muted-foreground">
                              Ref: {transaction.reference_number}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {transactions.length === 0 && (
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-navy-900 mb-2">
                        {t('rider.noTransactions')}
                      </h3>
                      <p className="text-muted-foreground">
                        Your transaction history will appear here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6 space-y-4">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowUpRight className="w-6 h-6 text-success" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-1">{t('rider.remitCash')}</h3>
                    <p className="text-sm text-muted-foreground">Submit COD collections</p>
                  </CardContent>
                </Card>

                <Card className="glass-card cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-info" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-1">{t('rider.withdraw')}</h3>
                    <p className="text-sm text-muted-foreground">Withdraw earnings</p>
                  </CardContent>
                </Card>

                <Card className="glass-card cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Download className="w-6 h-6 text-warning" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-1">{t('rider.downloadReport')}</h3>
                    <p className="text-sm text-muted-foreground">Export transaction history</p>
                  </CardContent>
                </Card>

                <Card className="glass-card cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-gold-500" />
                    </div>
                    <h3 className="font-bold text-navy-900 mb-1">{t('rider.bonusProgram')}</h3>
                    <p className="text-sm text-muted-foreground">View bonus opportunities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">{t('rider.quickStats')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-navy-900">
                        {transactions.filter(t => t.transaction_type === 'delivery_fee').length}
                      </div>
                      <div className="text-sm text-muted-foreground">{t('rider.deliveriesPaid')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-navy-900">
                        {transactions.filter(t => t.transaction_type === 'bonus').length}
                      </div>
                      <div className="text-sm text-muted-foreground">{t('rider.bonusesReceived')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {formatCurrency(
                          transactions
                            .filter(t => t.transaction_type === 'cod_collection')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{t('rider.totalCODCollected')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold-600">
                        {formatCurrency(
                          transactions
                            .filter(t => ['delivery_fee', 'bonus'].includes(t.transaction_type))
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{t('rider.totalEarnings')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RiderWallet;