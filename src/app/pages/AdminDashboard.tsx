/**
 * Admin Dashboard Page
 *
 * Main admin dashboard with system overview and quick actions.
 * Only accessible to users with admin role.
 */

import { Settings, Users, Database, Activity, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '../../services/auth';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

export function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      label: 'Total Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'API Calls Today',
      value: '45,678',
      change: '+8%',
      icon: Activity,
      color: 'text-green-400',
    },
    {
      label: 'Cache Hit Rate',
      value: '87%',
      change: '+3%',
      icon: Database,
      color: 'text-purple-400',
    },
    {
      label: 'Active Sessions',
      value: '423',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-orange-400',
    },
  ];

  const quickActions = [
    {
      label: 'System Settings',
      description: 'Configure API keys and service integrations',
      href: '/admin/settings',
      icon: Settings,
      color: 'from-blue-500 to-purple-600',
    },
    {
      label: 'User Management',
      description: 'Manage users and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'from-green-500 to-blue-600',
    },
    {
      label: 'System Health',
      description: 'Monitor service status and performance',
      href: '/admin/health',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Welcome back, {user?.email}
            <Badge className="ml-3 bg-purple-500/20 text-purple-300 border-purple-400/30">
              Admin
            </Badge>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer group">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{action.label}</h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
            <div className="space-y-4">
              {[
                {
                  event: 'New user registration',
                  user: 'john@example.com',
                  time: '2 minutes ago',
                },
                {
                  event: 'API rate limit warning',
                  user: 'Finnhub API',
                  time: '15 minutes ago',
                },
                {
                  event: 'Cache cleared',
                  user: 'System',
                  time: '1 hour ago',
                },
                {
                  event: 'User role updated',
                  user: 'sarah@example.com',
                  time: '2 hours ago',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">{activity.event}</p>
                    <p className="text-sm text-gray-400">{activity.user}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
