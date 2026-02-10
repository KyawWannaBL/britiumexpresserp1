import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/lib/LanguageContext";
import {
  LayoutDashboard,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Users,
  FileText,
  DollarSign
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminDashboardAPI } from "@/lib/admin-api";

export default function Dashboard() {
  const { t } = useLanguageContext();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await AdminDashboardAPI.getOverviewStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("admin.systemOverview")} / စနစ်အနှစ်ချုပ် ကြည့်ရှုရန်
        </h1>
        <p className="text-gray-600 mt-1">
          {t("admin.manageSystemAccess")} / Real-time logistics monitoring.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users / စုစုပေါင်း အသုံးပြုသူများ"
          value={stats.users?.total || 0}
          color="blue"
          trend="+12%"
        />
        <StatCard
          icon={Package}
          label="Active Shipments / လက်ရှိ ပို့ဆောင်မှုများ"
          value="2,847"
          color="orange"
          trend="+8%"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Today / ယနေ့ ပြီးစီးသော"
          value="156"
          color="green"
          trend="+15%"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue (MMK) / ဝင်ငွေ"
          value="45.2M"
          color="purple"
          trend="+23%"
        />
      </div>

      {/* User Management Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management Overview / အသုံးပြုသူ စီမံခန့်ခွဲမှု</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users / လက်ရှိ အသုံးပြုသူများ</span>
                <span className="font-semibold text-green-600">{stats.users?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suspended / ရပ်ဆိုင်းထားသော</span>
                <span className="font-semibold text-red-600">{stats.users?.suspended || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Approval / အတည်ပြုရန်</span>
                <span className="font-semibold text-orange-600">{stats.users?.pending || 0}</span>
              </div>
              
              {/* Role Distribution */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Role Distribution / အခန်းကဏ္ဍ ခွဲဝေမှု</h4>
                <div className="space-y-2">
                  {Object.entries(stats.users?.byRole || {}).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{role.replace('_', ' ')}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload Activity / အများအပြား အပ်လုဒ် လုပ်ဆောင်မှု</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Uploads / စုစုပေါင်း အပ်လုဒ်များ</span>
                <span className="font-semibold">{stats.uploads?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed / ပြီးစီးသော</span>
                <span className="font-semibold text-green-600">{stats.uploads?.completed || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing / လုပ်ဆောင်နေသော</span>
                <span className="font-semibold text-blue-600">{stats.uploads?.processing || 0}</span>
              </div>
              
              {/* Recent Uploads */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Recent Uploads / လတ်တလော အပ်လုဒ်များ</h4>
                <div className="space-y-2">
                  {(stats.uploads?.recent || []).slice(0, 3).map((upload: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="truncate">{upload.filename}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        upload.status === 'completed' ? 'bg-green-100 text-green-800' :
                        upload.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {upload.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tariff & Customer Service Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tariff Management / နှုန်းထား စီမံခန့်ခွဲမှု</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Countries / စုစုပေါင်း နိုင်ငံများ</span>
                <span className="font-semibold">{stats.tariffs?.countries || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Rates / လက်ရှိ နှုန်းထားများ</span>
                <span className="font-semibold text-green-600">{stats.tariffs?.total || 0}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-blue-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">International Coverage</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Covering major shipping routes across Asia, Europe, and Americas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Service / ဖောက်သည် ဝန်ဆောင်မှု</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Interactions / စုစုပေါင်း ဆက်သွယ်မှုများ</span>
                <span className="font-semibold">{stats.customerService?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Open Tickets / ဖွင့်ထားသော တောင်းဆိုမှုများ</span>
                <span className="font-semibold text-orange-600">{stats.customerService?.open || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolved / ဖြေရှင်းပြီးသော</span>
                <span className="font-semibold text-green-600">{stats.customerService?.resolved || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Satisfaction Rating / ကျေနပ်မှု အဆင့်</span>
                <span className="font-semibold text-blue-600">
                  {stats.customerService?.avgRating || 0}/5 ⭐
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolution Rate / ဖြေရှင်းမှု နှုန်း</span>
                <span className="font-semibold text-green-600">
                  {stats.customerService?.resolutionRate || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions / မြန်ဆန်သော လုပ်ဆောင်ချက်များ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Users}
              title="User Management"
              subtitle="Manage users & roles"
              href="/admin/user-management"
            />
            <QuickActionCard
              icon={FileText}
              title="Bulk Upload"
              subtitle="Upload shipments"
              href="/admin/bulk-upload"
            />
            <QuickActionCard
              icon={Globe}
              title="Tariff Settings"
              subtitle="Manage pricing"
              href="/admin/tariff-setting"
            />
            <QuickActionCard
              icon={Package}
              title="Shipments"
              subtitle="View all shipments"
              href="/admin/shipments"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-green-600 bg-green-50"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ icon: Icon, title, subtitle, href }: any) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}