import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useLoginMutation } from '@/features/auth/authApi';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import { roleHome } from '@/widgets/ProtectedRoute/RoleGuard';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [login, { isLoading }] = useLoginMutation();

  function validate(): boolean {
    const next: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { user } = await login({ email, password }).unwrap();
      toast.success('Welcome back', user.login);
      // Prefer the URL the user was trying to reach; otherwise role-based home.
      const intended = (location.state?.from as unknown as { pathname?: string })?.pathname;
      navigate(intended ?? roleHome(user.role), { replace: true });
    } catch (err: any) {
      const msg =
        err?.data?.message ?? err?.error ?? 'Could not sign you in. Please try again.';
      toast.error('Sign-in failed', Array.isArray(msg) ? msg.join(', ') : String(msg));
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-brand-50 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 shadow-soft">
            <Sparkles size={20} />
          </div>
          <h1 className="font-display text-3xl text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Sign in to continue to your library
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="p-1 text-ink-soft hover:text-ink transition"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password}
            required
          />

          <Button type="submit" loading={isLoading} fullWidth size="lg">
            Sign in
          </Button>

          <p className="text-center text-xs text-ink-soft">
            Don't have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Ask an admin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
