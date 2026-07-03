'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  
  const { login, error: authError, isAuthenticated, clearError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle rate limit countdown
  useEffect(() => {
    if (rateLimitTimer > 0) {
      const timer = setTimeout(() => setRateLimitTimer(rateLimitTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitTimer === 0 && isRateLimited) {
      setIsRateLimited(false);
    }
  }, [rateLimitTimer, isRateLimited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      if (!username.trim() || !password) {
        return;
      }

      const success = await login(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        router.push('/dashboard');
      } else if (authError?.includes('rate limit') || authError?.includes('Too many')) {
        setIsRateLimited(true);
        setRateLimitTimer(60); // 60 second lockout
      }
    } catch (err) {
      console.error('[v0] Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kabaza</h1>
          <p className="text-slate-300">Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-slate-700 bg-slate-800">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-slate-100">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rate Limit Warning */}
              {isRateLimited && (
                <div className="flex gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-300">Too many login attempts</p>
                    <p className="text-sm text-red-200 mt-1">
                      Please try again in {rateLimitTimer} second{rateLimitTimer !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {authError && !isRateLimited && (
                <div className="flex gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-200">{authError}</p>
                  </div>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-slate-200">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading || isRateLimited}
                  required
                  autoComplete="username"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isRateLimited}
                  required
                  autoComplete="current-password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || isRateLimited || !username || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              <p className="text-xs text-slate-400 text-center pt-2">
                Access issues? Contact your administrator
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          © 2024 Kabaza Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
