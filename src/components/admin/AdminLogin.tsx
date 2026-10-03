import React, { useState } from 'react';
import { Terminal, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const { loginWithGoogle, closeAdmin, companyConfig, adminEmail } = useAdmin();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) setError(result.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md">
        <button type="button" onClick={closeAdmin} className="inline-flex items-center gap-2 mb-6 text-sm text-slate-400 hover:text-sky-400 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Return to Website
        </button>
        <div className="bg-[#0C111A] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{companyConfig.name}</h1>
              <p className="text-sm text-slate-400">Owner Administration</p>
            </div>
          </div>
          <div className="p-4 mb-6 rounded-lg bg-slate-900 border border-slate-800 text-sm">
            <p className="flex items-center gap-2 font-semibold mb-2"><Shield className="w-4 h-4 text-sky-400" /> Owner Verification Required</p>
            <p className="text-slate-400">Sign in with the verified Google account <span className="text-sky-400 break-all">{adminEmail}</span> to edit the website.</p>
          </div>
          <button type="button" onClick={handleSignIn} disabled={isLoading} className="w-full py-3 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm disabled:opacity-50 cursor-pointer">
            {isLoading ? 'Verifying Owner...' : 'Sign In with Google'}
          </button>
          {error && <div role="alert" className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-sm"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span></div>}
        </div>
      </div>
    </div>
  );
}
