"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus,
  UserPlus,
  Building2,
  Zap,
  Target,
  FileText,
  Share2,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  monthlySalary: number;
  paymentSchedule: string;
  earnings: number;
  skills: string[];
  tasks: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  earnings: number;
  tasks: string[];
  skills: string[];
}

interface Payment {
  id: string;
  recipientId: string;
  recipientType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  description: string;
  createdAt: number;
}

interface RevenueData {
  microtasks: any[];
  affiliateCampaigns: any[];
  contentProjects: any[];
  referralPrograms: any[];
  platformAccounts: any[];
  revenueLogs: any[];
}

interface MegavaultData {
  currentBalance: number;
  totalInflow: number;
  totalOutflow: number;
  totalProfit: number;
  totalDividends: number;
  transactions: any[];
}

const EmploymentDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>({
    microtasks: [],
    affiliateCampaigns: [],
    contentProjects: [],
    referralPrograms: [],
    platformAccounts: [],
    revenueLogs: [],
  });
  const [megavaultData, setMegavaultData] = useState<MegavaultData>({
    currentBalance: 0,
    totalInflow: 0,
    totalOutflow: 0,
    totalProfit: 0,
    totalDividends: 0,
    transactions: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Form states
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRevenueForm, setShowRevenueForm] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch employees
      const empResponse = await fetch('/api/employment?type=employees');
      const empData = await empResponse.json();
      if (empData.success) setEmployees(empData.data);

      // Fetch users
      const userResponse = await fetch('/api/employment?type=users');
      const userData = await userResponse.json();
      if (userData.success) setUsers(userData.data);

      // Fetch payments
      const paymentResponse = await fetch('/api/employment/payment?type=payments');
      const paymentData = await paymentResponse.json();
      if (paymentData.success) setPayments(paymentData.data);

      // Fetch revenue data
      const revenueResponse = await fetch('/api/employment/revenue');
      const revenueData = await revenueResponse.json();
      if (revenueData.success) setRevenueData(revenueData.data);

      // Fetch megavault data
      const megavaultResponse = await fetch('/api/employment/megavault?type=balance');
      const megavaultData = await megavaultResponse.json();
      if (megavaultData.success) setMegavaultData(megavaultData.data);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employment data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalRevenue = revenueData.revenueLogs.reduce((sum, log) => sum + (log.amount || 0), 0);

  // Handle employee enrollment
  const handleEmployeeEnrollment = async (formData: any) => {
    try {
      const response = await fetch('/api/employment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'employee',
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Employee enrolled successfully",
        });
        fetchData();
        setShowEmployeeForm(false);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll employee",
        variant: "destructive",
      });
    }
  };

  // Handle user enrollment
  const handleUserEnrollment = async (formData: any) => {
    try {
      const response = await fetch('/api/employment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'user',
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "User enrolled successfully",
        });
        fetchData();
        setShowUserForm(false);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll user",
        variant: "destructive",
      });
    }
  };

  // Handle payment processing
  const handlePaymentProcessing = async (formData: any) => {
    try {
      const response = await fetch('/api/employment/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_payment',
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Payment processed successfully",
        });
        fetchData();
        setShowPaymentForm(false);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  // Handle revenue generation
  const handleRevenueGeneration = async (formData: any) => {
    try {
      const response = await fetch('/api/employment/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: formData.type,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Revenue generated successfully",
        });
        fetchData();
        setShowRevenueForm(false);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate revenue",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employment data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employment Dashboard</h1>
          <p className="text-muted-foreground">Master-only employment and revenue management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowEmployeeForm(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
          <Button onClick={() => setShowUserForm(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Megavault Balance</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${megavaultData.currentBalance?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="megavault">Megavault</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {revenueData.revenueLogs.slice(0, 10).map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{log.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          ${log.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowPaymentForm(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Payment
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowRevenueForm(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Revenue
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('megavault')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Megavault
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('revenue')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employees ({totalEmployees})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                        <p className="text-sm font-medium">${employee.monthlySalary}/month</p>
                        <p className="text-xs text-muted-foreground">Earned: ${employee.earnings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users ({totalUsers})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <p className="text-sm font-medium">Earned: ${user.earnings}</p>
                        <p className="text-xs text-muted-foreground">{user.tasks.length} tasks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments ({totalPayments})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{payment.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.recipientType}: {payment.recipientId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm font-medium">${payment.amount}</p>
                        <p className="text-xs text-muted-foreground">{payment.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Microtasks */}
            <Card>
              <CardHeader>
                <CardTitle>Microtasks ({revenueData.microtasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {revenueData.microtasks.slice(0, 5).map((task, index) => (
                      <div key={index} className="p-2 border rounded">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.category}</p>
                        <p className="text-sm font-medium">${task.reward}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Affiliate Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Campaigns ({revenueData.affiliateCampaigns.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {revenueData.affiliateCampaigns.slice(0, 5).map((campaign, index) => (
                      <div key={index} className="p-2 border rounded">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.product}</p>
                        <p className="text-sm font-medium">{campaign.commission}% commission</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Content Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Content Projects ({revenueData.contentProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {revenueData.contentProjects.slice(0, 5).map((project, index) => (
                      <div key={index} className="p-2 border rounded">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.type}</p>
                        <p className="text-sm font-medium">${project.reward}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Platform Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Accounts ({revenueData.platformAccounts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {revenueData.platformAccounts.slice(0, 5).map((account, index) => (
                      <div key={index} className="p-2 border rounded">
                        <h4 className="font-medium">{account.platform}</h4>
                        <p className="text-sm text-muted-foreground">{account.status}</p>
                        <p className="text-sm font-medium">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Megavault Tab */}
        <TabsContent value="megavault" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Megavault Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  ${megavaultData.currentBalance?.toLocaleString() || 0}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Inflow:</span>
                    <span className="font-medium">${megavaultData.totalInflow?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Outflow:</span>
                    <span className="font-medium">${megavaultData.totalOutflow?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Profit:</span>
                    <span className="font-medium text-green-600">
                      ${megavaultData.totalProfit?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Dividends:</span>
                    <span className="font-medium">${megavaultData.totalDividends?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {megavaultData.transactions?.slice(0, 10).map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={tx.type === 'inflow' ? 'default' : 'secondary'}>
                          ${tx.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms would be implemented as modals or separate components */}
      {/* For brevity, showing placeholder buttons */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Add Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Employee form would be implemented here</p>
              <Button onClick={() => setShowEmployeeForm(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Add User</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User form would be implemented here</p>
              <Button onClick={() => setShowUserForm(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Process Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment form would be implemented here</p>
              <Button onClick={() => setShowPaymentForm(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showRevenueForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Generate Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Revenue form would be implemented here</p>
              <Button onClick={() => setShowRevenueForm(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmploymentDashboard; 