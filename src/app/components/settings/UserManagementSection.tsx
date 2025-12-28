/**
 * UserManagementSection Component
 *
 * Admin section for managing users: list, add, edit, deactivate.
 * Fetches real user data from the backend API.
 */

import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  User,
  Plus,
  Search,
  Pencil,
  Power,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import { SettingsSection, SettingsGroup } from './SettingsSection';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { useUserManagement, type User as UserType } from '../../../hooks/useUserManagement';

interface UserManagementSectionProps {
  currentUserEmail?: string;
}

export function UserManagementSection({
  currentUserEmail,
}: UserManagementSectionProps) {
  const {
    users,
    pagination,
    stats,
    isLoading,
    error,
    filters,
    fetchUsers,
    fetchStats,
    createUser,
    updateUser,
    deactivateUser,
    reactivateUser,
    resetPassword,
    updateFilters,
    goToPage,
    clearError,
  } = useUserManagement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // Fetch users and stats on mount
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        updateFilters({ search: searchQuery, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    updateFilters({ role: role || undefined, page: 1 });
  };

  // Handle user activation toggle
  const handleToggleActive = async (user: UserType) => {
    if (user.email === currentUserEmail) {
      return; // Can't deactivate yourself
    }

    if (user.isActive) {
      await deactivateUser(user.id);
    } else {
      await reactivateUser(user.id);
    }
  };

  const formatDate = (isoString: string | null): string => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SettingsSection
      description="Manage user accounts, roles, and permissions"
      icon={Users}
      iconColor="from-indigo-500 to-purple-600"
      title="User Management"
    >
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-700/50 border border-white/10 text-center">
          <p className="text-2xl font-bold text-white">{stats?.total || users.length}</p>
          <p className="text-sm text-gray-400">Total Users</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30 text-center">
          <p className="text-2xl font-bold text-green-300">{stats?.active || 0}</p>
          <p className="text-sm text-green-400">Active</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30 text-center">
          <p className="text-2xl font-bold text-purple-300">{stats?.admins || 0}</p>
          <p className="text-sm text-purple-400">Admins</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30 text-center">
          <p className="text-2xl font-bold text-blue-300">{stats?.users || 0}</p>
          <p className="text-sm text-blue-400">Users</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-700/50 border-white/10 text-white placeholder-gray-400"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="px-3 py-2 bg-gray-700/50 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="moderator">Moderators</option>
          <option value="user">Users</option>
        </select>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchUsers()}
            disabled={isLoading}
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-red-400 hover:text-red-300"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* User List */}
      <SettingsGroup title={`Users (${pagination.total})`}>
        {isLoading && users.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No users found</p>
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search query</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-lg border transition-all ${
                  user.email === currentUserEmail
                    ? 'bg-blue-500/10 border-blue-400/30'
                    : !user.isActive
                    ? 'bg-gray-800/50 border-white/5 opacity-60'
                    : 'bg-gray-700/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300'
                          : user.role === 'moderator'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <Shield className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{user.email}</p>
                        {user.email === currentUserEmail && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                            You
                          </Badge>
                        )}
                        {!user.isActive && (
                          <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {user.displayName || 'No display name'} | Created: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          : user.role === 'moderator'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }
                    >
                      {user.role}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="text-gray-400 hover:text-blue-400"
                        title="Edit user"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {user.email !== currentUserEmail && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(user)}
                          className={`${
                            user.isActive
                              ? 'text-gray-400 hover:text-red-400'
                              : 'text-gray-400 hover:text-green-400'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Reactivate user'}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Last Login */}
                <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-500">
                    Last login: {formatDate(user.lastLoginAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <p className="text-sm text-gray-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || isLoading}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SettingsGroup>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={createUser}
      />

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={updateUser}
        onResetPassword={resetPassword}
        currentUserEmail={currentUserEmail}
      />
    </SettingsSection>
  );
}
