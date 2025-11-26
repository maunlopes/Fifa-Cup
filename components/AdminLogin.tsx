import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
    onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19] p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="text-brand-primary" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Access</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter password to manage simulation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Password"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                                } focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-900 dark:text-white transition-all`}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 ml-1">Incorrect password</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        Login
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};
