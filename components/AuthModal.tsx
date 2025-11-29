import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user: User;
      if (isLogin) {
        user = await db.login(email, password);
      } else {
        user = await db.register(name, email, password);
      }
      onLogin(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
        </button>
        
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {isLogin ? 'Sign in to access your safe space' : 'Join our supportive community today'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white"
                                placeholder="Jane Doe"
                                required={!isLogin}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
