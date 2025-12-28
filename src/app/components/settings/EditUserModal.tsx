/**
 * EditUserModal Component
 *
 * Modal dialog for editing existing users.
 */

import { useState, useEffect } from 'react';
import { Pencil, Mail, User, Shield, Power, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { User as UserType, UpdateUserData } from '../../../hooks/useUserManagement';

interface EditUserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateUserData) => Promise<{ success: boolean; error?: string }>;
  onResetPassword?: (id: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  currentUserEmail?: string;
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSubmit,
  onResetPassword,
  currentUserEmail,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCurrentUser = user?.email === currentUserEmail;

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        displayName: user.displayName || '',
        avatarEmoji: user.avatarEmoji || '',
        isActive: user.isActive,
      });
      setShowPasswordReset(false);
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation if resetting
    if (showPasswordReset) {
      if (!newPassword) {
        newErrors.password = 'New password is required';
      } else if (newPassword.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(newPassword)) {
        newErrors.password = 'Password must contain an uppercase letter';
      } else if (!/[a-z]/.test(newPassword)) {
        newErrors.password = 'Password must contain a lowercase letter';
      } else if (!/[0-9]/.test(newPassword)) {
        newErrors.password = 'Password must contain a number';
      }

      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Build update data (only changed fields)
    const updateData: UpdateUserData = {};

    if (formData.email !== user.email) {
      updateData.email = formData.email;
    }
    if (formData.role !== user.role && !isCurrentUser) {
      updateData.role = formData.role;
    }
    if (formData.displayName !== (user.displayName || '')) {
      updateData.displayName = formData.displayName;
    }
    if (formData.avatarEmoji !== (user.avatarEmoji || '')) {
      updateData.avatarEmoji = formData.avatarEmoji;
    }
    if (formData.isActive !== user.isActive && !isCurrentUser) {
      updateData.isActive = formData.isActive;
    }

    // Submit user update
    if (Object.keys(updateData).length > 0) {
      const result = await onSubmit(user.id, updateData);
      if (!result.success) {
        setErrors({ submit: result.error || 'Failed to update user' });
        setIsSubmitting(false);
        return;
      }
    }

    // Handle password reset if needed
    if (showPasswordReset && onResetPassword) {
      const pwResult = await onResetPassword(user.id, newPassword);
      if (!pwResult.success) {
        setErrors({ submit: pwResult.error || 'Failed to reset password' });
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setShowPasswordReset(false);
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-400" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Modify user details and permissions.
            {isCurrentUser && (
              <span className="block mt-1 text-yellow-400">
                Note: You cannot change your own role or deactivate yourself.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-700/50 border-white/10 text-white"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-displayName" className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4" />
              Display Name
            </Label>
            <Input
              id="edit-displayName"
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="John Doe"
              className="bg-gray-700/50 border-white/10 text-white"
            />
          </div>

          {/* Avatar Emoji */}
          <div className="space-y-2">
            <Label htmlFor="edit-emoji" className="text-gray-300">
              Avatar Emoji
            </Label>
            <Input
              id="edit-emoji"
              type="text"
              value={formData.avatarEmoji || ''}
              onChange={(e) => setFormData({ ...formData, avatarEmoji: e.target.value })}
              placeholder="e.g. 👤"
              className="bg-gray-700/50 border-white/10 text-white"
              maxLength={4}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="flex items-center gap-2 text-gray-300">
              <Shield className="w-4 h-4" />
              Role
            </Label>
            <select
              id="edit-role"
              value={formData.role || 'user'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              disabled={isCurrentUser}
              className="w-full px-3 py-2 bg-gray-700/50 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-white/5">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Account Active</span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              disabled={isCurrentUser}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isActive ? 'bg-green-600' : 'bg-gray-600'
              } ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Password Reset Toggle */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowPasswordReset(!showPasswordReset)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              <Key className="w-4 h-4" />
              {showPasswordReset ? 'Cancel Password Reset' : 'Reset Password'}
            </button>
          </div>

          {/* Password Reset Fields */}
          {showPasswordReset && (
            <div className="space-y-4 p-3 rounded-lg bg-gray-700/30 border border-white/5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="bg-gray-700/50 border-white/10 text-white"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-gray-300">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="bg-gray-700/50 border-white/10 text-white"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
              <p className="text-sm text-red-300">{errors.submit}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
