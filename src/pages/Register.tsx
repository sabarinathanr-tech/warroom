import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
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
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const ok = await register(name, email, password);
      if (ok) {
        showToast('Account created successfully', { type: 'success' });
        navigate('/dashboard', { replace: true });
      }
    } catch {
      showToast('Registration failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-zinc-950 flex text-[#171923] dark:text-zinc-100 font-sans">
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 md:p-16 max-w-xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#5B5CE2] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#171923] dark:text-zinc-100">
              WarRoom
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 mt-1">
              Start coordinating team rooms, sharing documents, and managing tasks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="e.g. Jordan Hayes"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              autoFocus
            />

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
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
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

            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-[#737987] dark:text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#5B5CE2] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="text-[11px] text-[#737987]/70 pt-8">
          By signing up, you agree to the WarRoom Terms & Privacy standards.
        </div>
      </div>

      {/* Right Column: Branded Hero (Desktop) */}
      <div className="hidden lg:flex flex-1 bg-white dark:bg-zinc-900 border-l border-[#E8EAF0] dark:border-zinc-800 flex-col justify-between p-16 relative">
        <div className="relative z-10 max-w-md my-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] dark:bg-zinc-800 flex items-center justify-center text-[#5B5CE2] mb-8">
            <Layers className="w-6 h-6" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#171923] dark:text-zinc-100 leading-tight">
            High-focus teamwork without noise.
          </h2>
          <p className="text-sm text-[#737987] dark:text-zinc-400 mt-3 leading-relaxed">
            Create rooms for sprints, launches, or research. Share live files and links, assign milestones, and keep the team aligned.
          </p>
        </div>

        <div className="text-xs text-[#737987] relative z-10">
          WarRoom Workspace • Engineered for Clarity
        </div>
      </div>
    </div>
  );
};
