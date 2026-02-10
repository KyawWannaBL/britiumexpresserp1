import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  FileText, 
  Download, 
  Calculator,
  CreditCard,
  Wallet,
  Building,
  Receipt,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Database,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLanguageContext } from '@/lib/LanguageContext';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'revenue' | 'expense';
  amount: number;
  status: 'completed' | 'processing' | 'pending';
}

interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'revenue' | 'expense';
  balance: number;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  actual: number;
  variance: number;
  percentage: number;
}

const FinancialManagementPage: React.FC = () => {
  const { language, t } = useLanguageContext();
  const { toast } = useToast();
  
  const [totalRevenue, setTotalRevenue] = useState(45678900);
  const [totalExpenses, setTotalExpenses] = useState(32456700);
  const [netProfit, setNetProfit] = useState(13222200);
  const [cashBalance, setCashBalance] = useState(8945600);

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2026-01-27',
      description: 'Delivery Payment - Order #12345',
      category: 'revenue',
      amount: 25000,
      status: 'completed'
    },
    {
      id: '2',
      date: '2026-01-27',
      description: 'Fuel Expense - Vehicle #456',
      category: 'expense',
      amount: -15000,
      status: 'processing'
    },
    {
      id: '3',
      date: '2026-01-26',
      description: 'Merchant Payment - ABC Store',
      category: 'revenue',
      amount: 45000,
      status: 'completed'
    }
  ];

  const chartOfAccounts: Account[] = [
    { id: '1001', name: 'Cash in Hand', type: 'asset', balance: 2345000 },
    { id: '1002', name: 'Bank Account', type: 'asset', balance: 6600600 },
    { id: '1003', name: 'Accounts Receivable', type: 'asset', balance: 1234500 },
    { id: '2001', name: 'Accounts Payable', type: 'liability', balance: 890000 },
    { id: '2002', name: 'Accrued Expenses', type: 'liability', balance: 456000 },
    { id: '4001', name: 'Delivery Revenue', type: 'revenue', balance: 42345000 },
    { id: '4002', name: 'Service Fees', type: 'revenue', balance: 3333900 }
  ];

  const invoices: Invoice[] = [
    { id: 'INV-2026-001', customer: 'ABC Trading Co.', date: '2026-01-27', amount: 125000, status: 'paid' },
    { id: 'INV-2026-002', customer: 'XYZ Store', date: '2026-01-26', amount: 89500, status: 'pending' },
    { id: 'INV-2026-003', customer: 'Global Mart', date: '2026-01-25', amount: 234000, status: 'overdue' }
  ];

  const budgetCategories: BudgetCategory[] = [
    { id: '1', name: 'Fuel & Transportation', budget: 15000000, actual: 12345000, variance: 2655000, percentage: 82.3 },
    { id: '2', name: 'Staff Salaries', budget: 20000000, actual: 18500000, variance: 1500000, percentage: 92.5 },
    { id: '3', name: 'Marketing', budget: 5000000, actual: 3200000, variance: 1800000, percentage: 64.0 },
    { id: '4', name: 'Technology', budget: 8000000, actual: 8500000, variance: -500000, percentage: 106.3 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'processing':
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-error/10 text-error border-error/20">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'asset':
        return <Wallet className="w-4 h-4 text-success" />;
      case 'liability':
        return <CreditCard className="w-4 h-4 text-error" />;
      case 'revenue':
        return <TrendingUp className="w-4 h-4 text-info" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-warning" />;
      default:
        return <DollarSign className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const generateReport = (type: string) => {
    toast({
      title: "Generating Report",
      description: `${type} report is being generated...`,
    });
  };

  const exportData = (format: string) => {
    toast({
      title: "Exporting Data",
      description: `Data is being exported in ${format} format...`,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gold-500/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Britium Express</h1>
            <p className="text-muted-foreground">Financial Management Center</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">Financial Controller</p>
            <p className="text-xs text-muted-foreground">finance@britium.com</p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Financial Metrics */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-success">+12.5% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-warning">+8.3% from last month</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-navy-900">{formatCurrency(netProfit)}</p>
                <p className="text-xs text-success">+18.7% from last month</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                <p className="text-2xl font-bold text-navy-900">{formatCurrency(cashBalance)}</p>
                <p className="text-xs text-info">Available funds</p>
              </div>
              <Wallet className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue vs Expenses Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Revenue vs Expenses</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Last 6 Months</Button>
                      <Button variant="outline" size="sm">Last Year</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <BarChart3 className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Expense Breakdown</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">This Month</Button>
                      <Button variant="outline" size="sm">Last Month</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded">
                    <PieChart className="w-16 h-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Description</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-3">{transaction.date}</td>
                          <td className="p-3">{transaction.description}</td>
                          <td className="p-3 capitalize">{transaction.category}</td>
                          <td className={`p-3 font-semibold ${transaction.amount > 0 ? 'text-success' : 'text-error'}`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                          </td>
                          <td className="p-3">{getStatusBadge(transaction.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounting" className="space-y-6">
            {/* Chart of Accounts */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chart of Accounts</CardTitle>
                  <Button className="btn-premium">
                    <Building className="w-4 h-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-success">Assets</h4>
                    <div className="space-y-2">
                      {chartOfAccounts.filter(acc => acc.type === 'asset').map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            {getAccountTypeIcon(account.type)}
                            <span className="text-sm">{account.id} - {account.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(account.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-error">Liabilities</h4>
                    <div className="space-y-2">
                      {chartOfAccounts.filter(acc => acc.type === 'liability').map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            {getAccountTypeIcon(account.type)}
                            <span className="text-sm">{account.id} - {account.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(account.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-info">Revenue</h4>
                    <div className="space-y-2">
                      {chartOfAccounts.filter(acc => acc.type === 'revenue').map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            {getAccountTypeIcon(account.type)}
                            <span className="text-sm">{account.id} - {account.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(account.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoicing" className="space-y-6">
            {/* Invoices */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoices</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button className="btn-premium">
                      <FileText className="w-4 h-4 mr-2" />
                      New Invoice
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Invoice #</th>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b">
                          <td className="p-3 font-medium">{invoice.id}</td>
                          <td className="p-3">{invoice.customer}</td>
                          <td className="p-3">{invoice.date}</td>
                          <td className="p-3 font-semibold">{formatCurrency(invoice.amount)}</td>
                          <td className="p-3">{getStatusBadge(invoice.status)}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            {/* Budget vs Actual */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900">{formatCurrency(50000000)}</div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{formatCurrency(32456700)}</div>
                    <p className="text-sm text-muted-foreground">Actual Spent</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{formatCurrency(17543300)}</div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">64.9%</div>
                    <p className="text-sm text-muted-foreground">Budget Utilization</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Budget</th>
                        <th className="text-left p-3">Actual</th>
                        <th className="text-left p-3">Variance</th>
                        <th className="text-left p-3">% Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetCategories.map((category) => (
                        <tr key={category.id} className="border-b">
                          <td className="p-3 font-medium">{category.name}</td>
                          <td className="p-3">{formatCurrency(category.budget)}</td>
                          <td className="p-3">{formatCurrency(category.actual)}</td>
                          <td className={`p-3 font-semibold ${category.variance >= 0 ? 'text-success' : 'text-error'}`}>
                            {formatCurrency(Math.abs(category.variance))}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{category.percentage}%</span>
                              <Progress value={Math.min(category.percentage, 100)} className="w-20 h-2" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Financial Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Profit & Loss Statement')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Profit & Loss Statement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Balance Sheet')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Balance Sheet
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Cash Flow Statement')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Cash Flow Statement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Trial Balance')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Trial Balance
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Tax Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('VAT Return')}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      VAT Return
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Income Tax Report')}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Income Tax Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Withholding Tax')}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Withholding Tax
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => generateReport('Tax Summary')}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Tax Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {/* Audit Trail */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Audit Trail</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="p-2 bg-success/10 rounded">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Transaction Created</p>
                      <p className="text-sm text-muted-foreground">New delivery payment recorded</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <p>User: finance@britium.com</p>
                        <p>Action: CREATE_TRANSACTION</p>
                        <p>Amount: MMK 25,000</p>
                        <p>Reference: ORDER-12345</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2026-01-27 14:30:25</span>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="p-2 bg-info/10 rounded">
                      <FileText className="w-4 h-4 text-info" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Invoice Generated</p>
                      <p className="text-sm text-muted-foreground">Invoice INV-2026-001 created</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <p>User: admin@britium.com</p>
                        <p>Action: GENERATE_INVOICE</p>
                        <p>Customer: ABC Trading Co.</p>
                        <p>Amount: MMK 125,000</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2026-01-27 13:45:12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default FinancialManagementPage;