// app/signup/page.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Check, AlertCircle, User } from 'lucide-react'

// A dedicated component for the success message to keep the main component clean
const SignupSuccessMessage = ({ email }: { email: string }) => (
  <div className="text-center p-8 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl animate-fade-in-up">
    <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
        <Mail className="w-8 h-8" />
    </div>
    <h2 className="mt-6 text-2xl font-bold text-emerald-800">Confirm Your Email</h2>
    <p className="mt-2 text-emerald-700">
        We've sent a confirmation link to <strong className="font-semibold">{email}</strong>.
    </p>
    <p className="mt-2 text-sm text-emerald-600">Please check your inbox (and spam folder) to complete your registration.</p>
    <Link href="/login">
        <button className="mt-6 w-full py-3 px-6 rounded-xl font-semibold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-300">
          Back to Sign In
        </button>
      </Link>
  </div>
);


export default function SignupPage() {
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains number', met: /\d/.test(password) },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
    } else {
      // THIS IS THE KEY CHANGE: Set success state to true
      setSignupSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" 
          style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" 
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl rotate-12 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                BRAND<span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">DOS</span>
              </span>
              <div className="text-xs font-semibold text-emerald-600 -mt-1 tracking-wide">
                SOCIAL STUDIO
              </div>
            </div>
          </Link>
          
          <h1 className="text-4xl font-black text-stone-800 mb-2">Join Brand Dos</h1>
          <p className="text-stone-600">Create your account to get started</p>
        </div>

        <div className="bg-stone-50/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200">
          {signupSuccess ? (
            <SignupSuccessMessage email={email} />
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-4 border border-stone-300 rounded-2xl bg-white/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-stone-800 placeholder-stone-400"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-12 pr-12 py-4 border border-stone-300 rounded-2xl bg-white/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 text-stone-800 placeholder-stone-400"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" /> : <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-3 p-4 bg-white/50 rounded-2xl border border-stone-200">
                      <p className="text-xs font-semibold text-stone-700 mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                              {req.met && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs transition-colors ${req.met ? 'text-emerald-600' : 'text-stone-500'}`}>{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full pl-12 pr-12 py-4 border rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-2 transition-all duration-300 text-stone-800 placeholder-stone-400 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-stone-300 focus:border-emerald-500 focus:ring-emerald-200'
                      }`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button type="button" aria-label="Toggle password confirmation visibility" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" /> : <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-600 mt-1">Passwords do not match</p>}
                </div>

                {error && (
                  <div className="p-4 flex items-start gap-3 rounded-2xl border-l-4 border-red-500 bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="text-xs text-stone-600 bg-stone-100/50 p-4 rounded-2xl">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Privacy Policy</Link>.
                </div>

                <button type="submit" disabled={loading || password !== confirmPassword || !passwordRequirements.every(req => req.met)} className="group w-full py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-stone-50/80 text-stone-500 font-medium">Already have an account?</span></div>
              </div>

              <Link href="/login">
                <button className="w-full py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-stone-300 text-stone-700 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 bg-white/50 backdrop-blur-sm">
                  Sign In Instead
                </button>
              </Link>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors duration-300 flex items-center justify-center space-x-2">
            <span>← Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}