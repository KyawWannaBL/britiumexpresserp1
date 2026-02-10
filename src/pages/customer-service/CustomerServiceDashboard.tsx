import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/lib/LanguageContext";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Phone,
  Mail,
  User,
  Calendar
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomerServiceAPI, CustomerServiceInteraction } from "@/lib/admin-api";

export default function CustomerServiceDashboard() {
  const { t } = useLanguageContext();
  const [interactions, setInteractions] = useState<CustomerServiceInteraction[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadCustomerServiceData();
  }, []);

  const loadCustomerServiceData = async () => {
    try {
      setLoading(true);
      const [interactionsData, statsData] = await Promise.all([
        CustomerServiceAPI.list(),
        CustomerServiceAPI.getStats()
      ]);
      setInteractions(interactionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading customer service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInteraction = async (id: string, updates: Partial<CustomerServiceInteraction>) => {
    try {
      await CustomerServiceAPI.update(id, updates);
      loadCustomerServiceData();
    } catch (error) {
      console.error('Error updating interaction:', error);
    }
  };

  const filteredInteractions = interactions.filter(interaction => {
    if (selectedFilter === 'all') return true;
    return interaction.status === selectedFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("cs.dashboard")} / ဖောက်သည် ဝန်ဆောင်မှု ဒက်ရှ်ဘုတ်
          </h1>
          <p className="text-gray-600 mt-1">
            Manage customer interactions and support tickets / ဖောက်သည် ဆက်သွယ်မှုများနှင့် ပံ့ပိုးမှု တောင်းဆိုမှုများကို စီမံပါ
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tickets / အားလုံး</option>
            <option value="open">{t("cs.open")} / ဖွင့်ထားသော</option>
            <option value="in_progress">{t("cs.inProgress")} / လုပ်ဆောင်နေသော</option>
            <option value="resolved">{t("cs.resolved")} / ဖြေရှင်းပြီးသော</option>
            <option value="closed">{t("cs.closed")} / ပိတ်ထားသော</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={MessageSquare}
          label={t("cs.totalInteractions") + " / စုစုပေါင်း ဆက်သွယ်မှုများ"}
          value={stats.total || 0}
          color="blue"
          trend="+8%"
        />
        <KPICard
          icon={AlertCircle}
          label={t("cs.openTickets") + " / ဖွင့်ထားသော တောင်းဆိုမှုများ"}
          value={stats.open || 0}
          color="orange"
          trend="-5%"
        />
        <KPICard
          icon={CheckCircle}
          label={t("cs.resolvedTickets") + " / ဖြေရှင်းပြီးသော တောင်းဆိုမှုများ"}
          value={stats.resolved || 0}
          color="green"
          trend="+12%"
        />
        <KPICard
          icon={Star}
          label={t("cs.avgSatisfactionRating") + " / ပျမ်းမျှ ကျေနပ်မှု အဆင့်"}
          value={`${stats.avgRating || 0}/5`}
          color="purple"
          trend="+0.3"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics / စွမ်းဆောင်ရည် မက်ထရစ်များ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{t("cs.responseTime")} / ပျမ်းမျှ တုံ့ပြန်မှု အချိန်</span>
                </div>
                <span className="text-xl font-bold text-blue-600">2.5h</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{t("cs.resolutionRate")} / ဖြေရှင်းမှု နှုန်း</span>
                </div>
                <span className="text-xl font-bold text-green-600">{stats.resolutionRate || 0}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Customer Satisfaction / ဖောက်သည် ကျေနပ်မှု</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {stats.avgRating || 0}/5 ⭐
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Types / ဆက်သွယ်မှု အမျိုးအစားများ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {type.replace('_', ' ')} / {t(`cs.${type}`) || type}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${((count as number) / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions / လတ်တလော ဆက်သွယ်မှုများ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t("cs.customerName")} / ဖောက်သည် အမည်</th>
                  <th className="text-left py-3 px-4">{t("cs.subject")} / အကြောင်းအရာ</th>
                  <th className="text-left py-3 px-4">{t("cs.interactionType")} / အမျိုးအစား</th>
                  <th className="text-left py-3 px-4">{t("cs.priority")} / ဦးစားပေးမှု</th>
                  <th className="text-left py-3 px-4">{t("admin.status")} / အခြေအနေ</th>
                  <th className="text-left py-3 px-4">Created / ဖန်တီးသည့်အချိန်</th>
                  <th className="text-left py-3 px-4">{t("admin.action")} / လုပ်ဆောင်ချက်</th>
                </tr>
              </thead>
              <tbody>
                {filteredInteractions.slice(0, 10).map((interaction) => (
                  <tr key={interaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{interaction.customer_name}</div>
                          {interaction.customer_phone && (
                            <div className="text-xs text-gray-500">{interaction.customer_phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate" title={interaction.subject}>
                        {interaction.subject}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                        {interaction.interaction_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getPriorityColor(interaction.priority)}`}>
                        {interaction.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(interaction.status)}`}>
                        {interaction.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {interaction.status === 'open' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateInteraction(interaction.id, { status: 'in_progress' })}
                          >
                            Start
                          </Button>
                        )}
                        {interaction.status === 'in_progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateInteraction(interaction.id, { status: 'resolved' })}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {Math.round(((stats.resolved || 0) / (stats.total || 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
            <div className="text-sm text-gray-600">ဖြေရှင်းမှု နှုန်း</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">2.5h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
            <div className="text-sm text-gray-600">ပျမ်းမျှ တုံ့ပြန်မှု အချိန်</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.avgRating || 0}/5
            </div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
            <div className="text-sm text-gray-600">ဖောက်သည် ကျေနပ်မှု</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, trend }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}