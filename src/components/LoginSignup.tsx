import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, Loader2, Play } from 'lucide-react';

interface LoginSignupProps {
  onAuthSuccess: (token: string, userEmail: string, userName: string) => void;
  supabaseConfigured: boolean;
  geminiConfigured: boolean;
  systemStatus?: {
    supabase: { configured: boolean; status: string; message: string };
    gemini: { configured: boolean; status: string; message: string };
  } | null;
}

export default function LoginSignup({ onAuthSuccess, supabaseConfigured, geminiConfigured, systemStatus }: LoginSignupProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignUp ? { email, password, name } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        if (data.error === 'SUPABASE_NOT_CONFIGURED') {
          setErrorMessage('Database setup is not fully configured.');
        } else {
          const rawError = (data.error || '').toLowerCase();
          if (rawError.includes('invalid login credentials') || rawError.includes('invalid_credentials') || rawError.includes('invalid email or password')) {
            setErrorMessage('Invalid email or password.');
          } else if (rawError.includes('email rate limit') || rawError.includes('limit reached') || rawError.includes('rate limit')) {
            setErrorMessage('Rate limit reached. Please try again later.');
          } else if (rawError.includes('already registered') || rawError.includes('user already exists') || rawError.includes('already exists')) {
            setErrorMessage('An account with this email address already exists.');
          } else if (rawError.includes('valid email') || rawError.includes('email is invalid')) {
            setErrorMessage('Please enter a valid email address.');
          } else if (rawError.includes('password must be') || rawError.includes('password should be') || rawError.includes('at least 6 characters')) {
            setErrorMessage('Password must be at least 6 characters.');
          } else {
            setErrorMessage(data.error || 'Authentication failed.');
          }
        }
        setIsLoading(false);
        return;
      }

      const session = data.session;
      const user = data.user;

      if (isSignUp) {
        if (!session) {
          setSuccessMessage('Registration Completed! Your dossier profile is active and saved in the database.');
          setTimeout(() => {
            // Direct graceful sign-in completion transition
            onAuthSuccess('', user?.email || email, user?.user_metadata?.name || name);
          }, 1500);
        } else {
          setSuccessMessage('✓ Registration & Sign-In Completed! Welcome to the Social Detective Academy.');
          setTimeout(() => {
            onAuthSuccess(session.access_token, user?.email || email, user?.user_metadata?.name || name);
          }, 1500);
        }
      } else {
        if (!session || !session.access_token) {
          setErrorMessage('Failed to start session. If you just registered, please verify your email address first, or verify your credentials.');
          setIsLoading(false);
          return;
        }
        setSuccessMessage('✓ Sign-In Completed! Access granted, retrieving your security archives...');
        setTimeout(() => {
          onAuthSuccess(session.access_token, user?.email || email, user?.user_metadata?.name || name);
        }, 1500);
      }
    } catch (error) {
      console.error('Auth request error:', error);
      setErrorMessage('Could not connect to the service. Please verify your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-signup-viewport" className="w-full max-w-md mx-auto bg-[#321c0e]/60 border border-white/10 rounded-[32px] text-[#d9d2c9] p-6 md:p-8 shadow-2xl backdrop-blur-md animate-fade-in">
      
      {/* Void Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white p-1 rounded-full border border-[#ff8533]/30 mb-3 overflow-hidden shadow-inner">
          <img 
            src="/src/assets/images/detective_squirrel_1784269041754.jpg" 
            alt="Detective Fox Mascot Logo" 
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#fcfaf5] tracking-tight">
          Academy Dossier File
        </h2>
        <p className="text-xs text-[#a89485] font-mono mt-1 uppercase tracking-wider">
          {isSignUp ? 'Create investigator profile' : 'Sign in to access secure cases'}
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#1e110a] rounded-[24px] border border-white/5 mb-6">
        <button
          type="button"
          onClick={() => { setIsSignUp(false); setErrorMessage(null); }}
          className={`py-2 rounded-[24px] text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
            !isSignUp 
              ? 'bg-[#ff8533] text-[#1e110a] shadow-md' 
              : 'text-[#a89485] hover:text-[#fcfaf5]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(true); setErrorMessage(null); }}
          className={`py-2 rounded-[24px] text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
            isSignUp 
              ? 'bg-[#ff8533] text-[#1e110a] shadow-md' 
              : 'text-[#a89485] hover:text-[#fcfaf5]'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error & Success Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-[24px] border border-red-500/30 bg-red-950/20 text-red-400 text-xs leading-relaxed font-sans">
          <div className="font-semibold text-red-400">
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-[24px] border border-[#5c7f5c]/40 bg-[#5c7f5c]/10 text-[#5c7f5c] text-xs font-mono uppercase tracking-wider">
          {successMessage}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#a89485] uppercase tracking-wider mb-1.5">
              Investigator Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a89485]" />
              <input
                type="text"
                required
                placeholder="e.g. Detective Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1e110a] hover:bg-[#2a170a] focus:bg-[#120a06] border border-white/10 focus:border-[#ff8533] rounded-[24px] text-xs font-mono transition-all outline-none text-[#fcfaf5] focus:ring-1 focus:ring-[#ff8533]/30"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-mono font-bold text-[#a89485] uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a89485]" />
            <input
              type="email"
              required
              placeholder="e.g. agent@academy.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1e110a] hover:bg-[#2a170a] focus:bg-[#120a06] border border-white/10 focus:border-[#ff8533] rounded-[24px] text-xs font-mono transition-all outline-none text-[#fcfaf5] focus:ring-1 focus:ring-[#ff8533]/30"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono font-bold text-[#a89485] uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#a89485]" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1e110a] hover:bg-[#2a170a] focus:bg-[#120a06] border border-white/10 focus:border-[#ff8533] rounded-[24px] text-xs font-mono transition-all outline-none text-[#fcfaf5] focus:ring-1 focus:ring-[#ff8533]/30"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 mt-3 flex items-center justify-center gap-1.5 cursor-pointer text-[#1e110a]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#1e110a]" />
              <span>Loading Dossier...</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current text-[#1e110a]" />
              <span>{isSignUp ? 'Initialize Profile' : 'Access dossier'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
