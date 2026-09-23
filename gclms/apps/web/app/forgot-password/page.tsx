'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-elevated p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
            G
          </div>
          <span className="font-bold text-xl text-foreground-strong">GCLMS Portal</span>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="h-12 w-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground-strong mb-2">Reset Link Sent</h2>
            <p className="text-sm text-foreground-muted mb-6 leading-relaxed">
              If an account matches <span className="font-semibold text-foreground-strong">{email}</span>, we have sent instructions to reset your password. Please check your inbox or Mailpit preview.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground-strong mb-2">Reset Password</h1>
            <p className="text-sm text-foreground-muted mb-6">
              Enter your registered email address to receive a secure password reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground-strong uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@school.gclms.local"
                    className="w-full pl-10 pr-4 py-2.5 rounded-md bg-surface border border-border text-sm text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-md shadow-card transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
