import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/lib/LanguageContext";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  Award,
  Activity
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MarketerPerformanceAPI, MarketerPerformance } from "@/lib/admin-api";

export default function MarketerDashboard() {
  const { t } = useLanguageContext();
  const [performance, setPerformance] = useState<MarketerPerformance[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [performanceData, statsData] = await Promise.all([
        MarketerPerformanceAPI.list(),
        MarketerPerformanceAPI.getStats()
      ]);
      setPerformance(performanceData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading marketer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month performance (mock data for demo)
  const currentMonthStats = {
    leadsGenerated: 127,
    conversions: 34,
    revenue: 2450000,
    campaigns: 8,
    conversionRate: 26.8,
    acquisitionCost: 72059
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
            {t("marketer.dashboard")} / မားကတ်တင်း ဒက်ရှ်ဘုတ်
          </h1>
          <p className="text-gray-600 mt-1">
            Track your marketing performance and KPIs / သင်၏ မားကတ်တင်း စွမ်းဆောင်ရည်နှင့် KPI များကို ခြေရာခံပါ
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="current_month">This Month / ဤလ</option>
            <option value="last_month">Last Month / ပြီးခဲ့သောလ</option>
            <option value="quarter">This Quarter / ဤရာသီ</option>
            <option value="year">This Year / ဤနှစ်</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={Users}
          label={t("marketer.leadsGenerated") + " / လိုက်များ ဖန်တီးခဲ့သော"}
          value={currentMonthStats.leadsGenerated}
          color="blue"
          trend="+18%"
          target="150"
        />
        <KPICard
          icon={Target}
          label={t("marketer.conversions") + " / အပြောင်းအလဲများ"}
          value={currentMonthStats.conversions}
          color="green"
          trend="+12%"
          target="40"
        />
        <KPICard
          icon={DollarSign}
          label={t("marketer.revenueGenerated") + " / ဝင်ငွေ ဖန်တီးခဲ့သော"}
          value={`${(currentMonthStats.revenue / 1000000).toFixed(1)}M MMK`}
          color="purple"
          trend="+25%"
          target="3M MMK"
        />
        <KPICard
          icon={BarChart3}
          label={t("marketer.conversionRate") + " / အပြောင်းအလဲ နှုန်း"}
          value={`${currentMonthStats.conversionRate}%`}
          color="orange"
          trend="+3.2%"
          target="30%"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("marketer.performance")} / စွမ်းဆောင်ရည် မက်ထရစ်များ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Campaigns Run / လုပ်ဆောင်ခဲ့သော ကမ်ပိန်းများ</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{currentMonthStats.campaigns}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Acquisition Cost / ဖောက်သည် ရယူမှု ကုန်ကျစရိတ်</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {currentMonthStats.acquisitionCost.toLocaleString()} MMK
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Success Rate / အောင်မြင်မှု နှုန်း</span>
                </div>
                <span className="text-xl font-bold text-purple-600">87.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("marketer.targetAchievement")} / ပန်းတိုင် အောင်မြင်မှု</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar
                label="Leads Target / လိုက်များ ပန်းတိုင်"
                current={currentMonthStats.leadsGenerated}
                target={150}
                color="blue"
              />
              <ProgressBar
                label="Conversion Target / အပြောင်းအလဲ ပန်းတိုင်"
                current={currentMonthStats.conversions}
                target={40}
                color="green"
              />
              <ProgressBar
                label="Revenue Target / ဝင်ငွေ ပန်းတိုင်"
                current={currentMonthStats.revenue}
                target={3000000}
                color="purple"
                format="currency"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance / ကမ်ပိန်း စွမ်းဆောင်ရည်</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign Name / ကမ်ပိန်း အမည်</th>
                  <th className="text-left py-3 px-4">Type / အမျိုးအစား</th>
                  <th className="text-left py-3 px-4">Leads / လိုက်များ</th>
                  <th className="text-left py-3 px-4">Conversions / အပြောင်းအလဲများ</th>
                  <th className="text-left py-3 px-4">Rate / နှုန်း</th>
                  <th className="text-left py-3 px-4">Revenue / ဝင်ငွေ</th>
                  <th className="text-left py-3 px-4">Status / အခြေအနေ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">New Year Express Delivery</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Digital
                    </span>
                  </td>
                  <td className="py-3 px-4">45</td>
                  <td className="py-3 px-4">12</td>
                  <td className="py-3 px-4">26.7%</td>
                  <td className="py-3 px-4">850,000 MMK</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">International Shipping Promo</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Social Media
                    </span>
                  </td>
                  <td className="py-3 px-4">32</td>
                  <td className="py-3 px-4">8</td>
                  <td className="py-3 px-4">25.0%</td>
                  <td className="py-3 px-4">650,000 MMK</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Business Partnership Drive</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      Email
                    </span>
                  </td>
                  <td className="py-3 px-4">28</td>
                  <td className="py-3 px-4">9</td>
                  <td className="py-3 px-4">32.1%</td>
                  <td className="py-3 px-4">720,000 MMK</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Paused
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>{t("marketer.monthlyReport")} / လစဉ် အစီရင်ခံစာ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalLeads?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600">Total Leads Generated</div>
              <div className="text-sm text-gray-600">စုစုပေါင်း လိုက်များ ဖန်တီးခဲ့သော</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totalConversions?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600">Total Conversions</div>
              <div className="text-sm text-gray-600">စုစုပေါင်း အပြောင်းအလဲများ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {((stats.totalRevenue || 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Revenue (MMK)</div>
              <div className="text-sm text-gray-600">စုစုပေါင်း ဝင်ငွေ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, trend, target }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-sm text-green-600 font-medium">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          {target && (
            <p className="text-xs text-gray-500">Target: {target}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, current, target, color, format = "number" }: any) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const formatValue = (value: number) => {
    if (format === "currency") {
      return `${(value / 1000000).toFixed(1)}M MMK`;
    }
    return value.toLocaleString();
  };

  const colors: any = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">
          {formatValue(current)} / {formatValue(target)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colors[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}