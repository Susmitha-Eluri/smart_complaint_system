import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../context/MockDataContext';
import { CheckCircle2, Eye, EyeOff, GraduationCap, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Role } from '../types';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, users } = useMockData();
  const navigate = useNavigate();

  // For demo convenience, autofill credentials based on role
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setError('');
    const demoUser = users.find(u => u.role === newRole);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword('password123'); // Demo password
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email);
      if (success) {
        navigate(`/${role}`);
      } else {
        setError('Invalid credentials. Please use demo credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex w-1/2 bg-navy-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract shapes for background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-royal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center font-bold text-navy-900 text-xl">
              GV
            </div>
            <span className="font-bold tracking-wider">GVPIHLR</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Smart Complaint<br />System
          </h1>
          <p className="text-xl text-royal-400 font-medium mb-4">
            "Your Voice • Our Campus • Better Tomorrow"
          </p>
          <p className="text-slate-300 max-w-md">
            Report campus issues, track progress, and help build a better campus environment together.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle2 className="text-gold-500 w-5 h-5" />
            <span>Easy and quick reporting process</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle2 className="text-gold-500 w-5 h-5" />
            <span>Real-time tracking of your complaints</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle2 className="text-gold-500 w-5 h-5" />
            <span>Faster resolution by dedicated teams</span>
          </div>
        </div>
      </div>

      {/* Right Column - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-light-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center font-bold text-white text-xl">
              GV
            </div>
            <span className="font-bold text-navy-900 tracking-wider">GVPIHLR</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Login to your account to continue</p>
          </div>

          <div className="card">
            {/* Role Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'student' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'faculty' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4" /> Faculty
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'admin' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="label-text">College ID / Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="label-text mb-0">Password</label>
                  <a href="#" className="text-sm text-royal-600 hover:text-royal-500 font-medium">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-11"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Login to Continue →'
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Demo tip: Click tabs to auto-fill mock credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
