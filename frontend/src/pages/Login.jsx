import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import {
  ShieldCheck,
  Train,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function Login() {
  const { loginWithOtp, quickLoginAs } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpInfo, setOtpInfo] = useState(null);

  const DEMO_PERSONAS = [
    {
      id: 'IR-TI-1042',
      name: 'Ramesh Kumar',
      role: 'Track Inspector',
      division: 'Central Div (Kalyan)',
      badge: 'Field Inspections',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
    {
      id: 'IR-SM-2091',
      name: 'Priya Sharma',
      role: 'Station Master',
      division: 'Mumbai CSMT Control',
      badge: 'Train Dispatch & Halts',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
    },
    {
      id: 'IR-MT-3084',
      name: 'David Miller',
      role: 'Maintenance Team',
      division: 'Fast Response Gang-04',
      badge: 'P-Way Emergency Repairs',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      id: 'IR-AD-4001',
      name: 'Dr. Rajesh Verma',
      role: 'Railway Administrator',
      division: 'Railway Board Safety Cell',
      badge: 'Analytics & Blockchain Audit',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
  ];

  // Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!employeeId && !email) {
      setError('Please provide your Employee ID or official Railway email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await authApi.requestOtp(employeeId, email);
      if (res.success) {
        setOtpInfo(res.data);
        setOtpStep(true);
        if (res.data.demoOtpCode) {
          setOtpCode(res.data.demoOtpCode); // Auto-fill demo OTP
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await loginWithOtp(otpInfo?.employeeId || employeeId, otpCode);
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Login
  /*const handleQuickPersona = async (personaId) => {
    setLoading(true);
    setError('');
    try {
      await quickLoginAs(personaId, '849201');
    } catch (err) {
      setError('Quick sign-in error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };*/

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Railway Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-2xl shadow-blue-900/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Train className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-tight">
          TRACKON
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400 max-w-xs mx-auto">
          Restricted Portal for Authorized Railway Employees Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {!otpStep ? (
            /* STEP 1: Employee ID & Email */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Official Railway Employee ID</span>
                  <span className="text-[10px] text-slate-500 font-mono">e.g. IR-TI-1042</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    placeholder="IR-TI-1042"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono tracking-wider uppercase transition-colors"
                  />
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">OR EMAIL</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Railway Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.kumar@railways.gov.in"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 border border-blue-400/30 transition-all disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <span>Generating Secure OTP...</span>
                ) : (
                  <>
                    <span>Generate Official OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>OTP Transmitted via SMS & Railway Email</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Target: {otpInfo?.maskedPhone} | {otpInfo?.maskedEmail}
                </p>
                <div className="mt-2 text-[10px] text-amber-300/90 font-mono bg-slate-950/60 p-1.5 rounded">
                  Demo Auto-Fill OTP Code: <strong>{otpInfo?.demoOtpCode || '849201'}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enter 6-Digit One-Time Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="849201"
                    className="block w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl tracking-[0.5em] font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Verify & Access Network</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 1-Click Persona Quick Testing Box */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Quick Testing Personas
              </span>
              <p className="text-[10px] text-slate-500">
                Instant bypass to test specific role capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickPersona(p.id)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-left transition-all text-xs flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-slate-200 group-hover:text-blue-300">
                      {p.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${p.color}`}>
                      {p.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{p.badge}</div>
                  <div className="text-[9px] font-mono text-slate-500 mt-1">{p.id}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Cryptographically Encrypted Session (Railway IT Directorate)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
