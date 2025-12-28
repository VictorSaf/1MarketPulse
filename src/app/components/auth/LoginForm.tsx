/**
 * Login Form Component
 *
 * Email/password login form with validation and error handling.
 * Supports both Supabase and mock authentication.
 */

import { useState, type FormEvent } from 'react';

import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuthStore , isMockMode } from '../../../services/auth';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Validation
    if (!email || !password) {
      setValidationError('Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Attempt login
    const success = await login(email, password);

    if (success) {
      navigate('/');
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your PULSE account</p>

          {isMockMode && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-xs text-yellow-300">
                Mock Mode: Use vict0r@vict0r.ro / Vict0r for admin access
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
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              to="/signup"
            >
              Sign up
            </Link>
          </p>
        </div>

        {isMockMode && (
          <div className="mt-6 p-4 rounded-lg bg-gray-900/50 border border-white/10">
            <p className="text-xs text-gray-400 font-medium mb-2">Test Accounts:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Admin: vict0r@vict0r.ro / Vict0r</p>
              <p>Demo: demo@demo.com / demo123</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
