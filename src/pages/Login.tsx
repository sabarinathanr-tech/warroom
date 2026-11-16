import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('alex.morgan@warroom.dev');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        showToast('Welcome back to WarRoom', { type: 'success' });
        navigate(from, { replace: true });
      }
    } catch {
      showToast('Login failed. Please check your credentials.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Password reset link sent (Demo)', {
      type: 'info',
      message: 'In production, an instruction email will be delivered to your inbox.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-zinc-950 flex text-[#171923] dark:text-zinc-100 font-sans">
      {/* Left Column: Focused Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 md:p-16 max-w-xl mx-auto w-full">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-[#5B5CE2] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#171923] dark:text-zinc-100">
              WarRoom
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 mt-1">
              Enter your credentials to access your team rooms and resources.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#737987] hover:text-[#171923] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#737987] dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E8EAF0] text-[#5B5CE2] focus:ring-[#5B5CE2]/20"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-[#5B5CE2] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Seed demo quick credential badge */}
          <div className="mt-6 p-3 bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl text-xs text-[#737987] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#171923] dark:text-zinc-300">Demo Account: </span>
              <span>alex.morgan@warroom.dev</span>
            </div>
            <span className="text-[11px] bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] px-2 py-0.5 rounded font-mono">
              Ready
            </span>
          </div>

          <p className="mt-8 text-center text-xs text-[#737987] dark:text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#5B5CE2] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="text-[11px] text-[#737987]/70 pt-8">
          WarRoom Prototype • Secure Local Storage Session
        </div>
      </div>

      {/* Right Column: Branded Minimalist Hero (Desktop only) */}
      <div className="hidden lg:flex flex-1 bg-white dark:bg-zinc-900 border-l border-[#E8EAF0] dark:border-zinc-800 flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Abstract floating cards illustration */}
        <div className="relative z-10 max-w-md my-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] dark:bg-zinc-800 flex items-center justify-center text-[#5B5CE2] mb-8">
            <Layers className="w-6 h-6" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#171923] dark:text-zinc-100 leading-tight">
            Bring your team into focus.
          </h2>
          <p className="text-sm text-[#737987] dark:text-zinc-400 mt-3 leading-relaxed">
            One shared space for resources, collaboration, and progress. Eliminate chat sprawl and keep milestones front and center.
          </p>

          {/* Interactive preview badge */}
          <div className="mt-10 p-5 bg-[#F7F8FA] dark:bg-zinc-800/50 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#171923] dark:text-zinc-200">Hackathon 2026</span>
              <span className="font-mono text-[#5B5CE2] font-semibold">75%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#5B5CE2] h-full w-3/4 rounded-full" />
            </div>
            <p className="text-[11px] text-[#737987]">3 of 4 milestones completed • 3 resources attached</p>
          </div>
        </div>

        <div className="text-xs text-[#737987] relative z-10">
          Refined SaaS Architecture • Zero Clutter Standard
        </div>
      </div>
    </div>
  );
};
