/**
 * Signup Form Component
 *
 * User registration form with validation and password confirmation.
 * Supports both Supabase and mock authentication.
 */

import { useState, type FormEvent } from 'react';

import { UserPlus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuthStore , isMockMode } from '../../../services/auth';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function SignupForm() {
  const navigate = useNavigate();
  const { signup, error, clearError, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Validation
    if (!email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Attempt signup
    const success = await signup(email, password);

    if (success) {
      navigate('/');
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join PULSE and start your journey</p>

          {isMockMode && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-xs text-yellow-300">
                Mock Mode: Account will be created in-memory only
              </p>
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {displayError && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{displayError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              disabled={isLoading}
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {password && confirmPassword && password === confirmPassword && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-xs text-green-400">Passwords match</p>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
