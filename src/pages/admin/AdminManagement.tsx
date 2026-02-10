import React, { useState, useEffect } from "react";
import { useLanguageContext } from "@/lib/LanguageContext";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCog,
  Search,
  Filter,
  Settings,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminUsersAPI, AdminUser } from "@/lib/admin-api";

export default function AdminManagement() {
  const { t } = useLanguageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [stats, setStats] = useState<any>({});

  // New user form state
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "warehouse_staff",
    hub_assignment: "Yangon Main Hub",
    phone: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        AdminUsersAPI.list(),
        AdminUsersAPI.getStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await AdminUsersAPI.create({
        ...newUser,
        role: newUser.role as AdminUser['role']
      });
      setShowAddUser(false);
      setNewUser({
        full_name: "",
        email: "",
        role: "warehouse_staff",
        hub_assignment: "Yangon Main Hub",
        phone: ""
      });
      loadData();
      alert(t('admin.createAccount') + ' - ' + t('admin.tempPasswordNote'));
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

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
            {t("admin.userManagement")} / အသုံးပြုသူ စီမံခန့်ခွဲမှု
          </h1>
          <p className="text-gray-600 mt-1">
            {t("admin.manageTierHierarchy")} / အဆင့် ၁၀ ဆင့်ရှိ အသုံးပြုသူစနစ်အား စီမံရန်
          </p>
        </div>
        <Button
          onClick={() => setShowAddUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {t("admin.addStaff")} / ဝန်ထမ်းအသစ်ထည့်ရန်
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={t('admin.totalUsers') || 'Total Users'}
          value={stats.total || 0}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label={t('admin.active')}
          value={stats.active || 0}
          color="green"
        />
        <StatCard
          icon={XCircle}
          label={t('admin.suspended')}
          value={stats.suspended || 0}
          color="red"
        />
        <StatCard
          icon={UserCog}
          label={t('admin.pending') || 'Pending'}
          value={stats.pending || 0}
          color="orange"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`${t('common.search')} users...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("admin.allRoles")}</option>
                <option value="super_admin">{t("admin.superAdmin")}</option>
                <option value="admin">{t("admin.manager")}</option>
                <option value="manager">{t("admin.manager")}</option>
                <option value="supervisor">{t("admin.supervisor")}</option>
                <option value="warehouse_staff">{t("admin.warehouseStaff")}</option>
                <option value="rider">{t("admin.rider")}</option>
                <option value="accountant">{t("admin.accountant")}</option>
                <option value="marketer">{t("admin.marketer")}</option>
                <option value="customer_service">{t("admin.customerService")}</option>
                <option value="merchant">{t("admin.merchant")}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.staffAccounts")} / ဝန်ထမ်းစာရင်း</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t("admin.userDetails")}</th>
                  <th className="text-left py-3 px-4">{t("admin.roleRBAC")}</th>
                  <th className="text-left py-3 px-4">{t("admin.assignedHub")}</th>
                  <th className="text-left py-3 px-4">{t("admin.status")}</th>
                  <th className="text-left py-3 px-4">{t("admin.action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {user.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{user.hub_assignment}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.status === 'active' ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {t('admin.active')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          {t('admin.suspended')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">{t("admin.createNewUser")}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.fullName")}</label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.emailLogin")}</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.role")}</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="manager">{t("admin.manager")}</option>
                  <option value="supervisor">{t("admin.supervisor")}</option>
                  <option value="warehouse_staff">{t("admin.warehouseStaff")}</option>
                  <option value="rider">{t("admin.riderDriver")}</option>
                  <option value="accountant">{t("admin.accountant")}</option>
                  <option value="marketer">{t("admin.marketer")}</option>
                  <option value="customer_service">{t("admin.customerService")}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t("admin.hubAssignment")}</label>
                <select
                  value={newUser.hub_assignment}
                  onChange={(e) => setNewUser({...newUser, hub_assignment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Yangon Main Hub">{t("admin.yangonMainHub")}</option>
                  <option value="Downtown Station">{t("admin.downtownStation")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("bulk.phone")}</label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="+95912345678"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mt-4 p-3 bg-yellow-50 rounded">
              {t("admin.tempPasswordNote")}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddUser(false)}
                className="flex-1"
              >
                {t("admin.cancel")}
              </Button>
              <Button
                onClick={handleCreateUser}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newUser.full_name || !newUser.email}
              >
                {t("admin.createAccount")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    orange: "text-orange-600 bg-orange-50"
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}