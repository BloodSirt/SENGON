import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth, DEMO_PROFILES } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, switchUser, currentUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0f111c] border border-[#737686]/30 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#004ac6]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-[#737686]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#004ac6] to-[#40c2fd] flex items-center justify-center shadow-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {isSignUp ? 'Create Sengon Account' : 'Welcome to Sengon'}
              </h2>
              <p className="text-[11px] text-gray-400">Next-gen dark social architecture platform</p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher */}
        <div className="my-5 p-3.5 rounded-2xl bg-[#141726] border border-[#737686]/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#40c2fd] block mb-2">
            ⚡️ Instant 1-Click Demo Profiles:
          </span>
          <div className="space-y-1.5">
            {DEMO_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  switchUser(p);
                  closeLoginModal();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  currentUser.id === p.id
                    ? 'bg-[#004ac6]/30 border border-[#40c2fd]/40 text-white font-semibold'
                    : 'hover:bg-[#1b2034] text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="text-left">
                    <span className="block font-bold">{p.name}</span>
                    <span className="text-[10px] text-gray-400">{p.role}</span>
                  </div>
                </div>
                {currentUser.id === p.id ? (
                  <CheckCircle2 className="w-4 h-4 text-[#40c2fd]" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[#737686]/20 w-full" />
          <span className="bg-[#0f111c] px-3 text-[11px] text-gray-500 font-medium">Or with email</span>
          <div className="border-t border-[#737686]/20 w-full" />
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">Your Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-500 absolute left-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Email address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@veloce.io"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141726] border border-[#737686]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#004ac6] to-[#1d68ff] hover:from-[#1d68ff] hover:to-[#40c2fd] text-white font-bold text-xs shadow-lg shadow-[#004ac6]/30 transition-all mt-4"
          >
            {isSignUp ? 'Create Free Account' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] text-gray-400 hover:text-[#40c2fd] transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

