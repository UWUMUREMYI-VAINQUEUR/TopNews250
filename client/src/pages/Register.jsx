import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import tnLogo from '../assets/tn.png';
import phoneImg from '../assets/phone.jpg';

export default function Register() {
  const { signupStart, signupVerify } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('error'); // 'error' or 'success'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMsg('');
    setLoading(true);
    const res = await signupStart(form);
    setLoading(false);

    if (res.ok) {
      setMsgType('success');
      setMsg('Verification code sent to your email. Check your inbox and spam folder.');
      setStage(2);
    } else {
      setMsgType('error');
      setMsg(res.message || 'Something went wrong. Try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMsg('');
    setLoading(true);
    const res = await signupVerify({ ...form, code });
    setLoading(false);

    if (res.ok) {
      navigate('/');
    } else {
      setMsgType('error');
      setMsg(res.message || 'Invalid code. Try again.');
    }
  };

  const handleBack = () => {
    setStage(1);
    setCode('');
    setMsg('');
  };

  const inputClass =
    'w-full p-3 border border-gray-600 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500';

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-900 text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {stage === 1 ? 'Create Account' : 'Verify Email'}
          </h2>

          {/* Message */}
          {msg && (
            <div
              className={`mb-4 text-center text-sm p-3 rounded ${
                msgType === 'success'
                  ? 'bg-green-800 text-green-200'
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {msg}
            </div>
          )}

          {/* Stage 1 — Registration Form */}
          {stage === 1 && (
            <form onSubmit={handleStart} className="space-y-4">
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={inputClass}
                placeholder="Username"
                required
                autoComplete="username"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Email"
                required
                autoComplete="email"
              />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="Phone"
                required
                autoComplete="tel"
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Password"
                required
                autoComplete="new-password"
                minLength={6}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-green-600 p-3 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading && <Spinner />}
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Stage 2 — Verify Code */}
          {stage === 2 && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-gray-400 text-sm text-center">
                We sent a 6-digit code to <span className="text-white font-semibold">{form.email}</span>.
                Check your inbox and spam folder.
              </p>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                placeholder="Enter 6-digit code"
                className={inputClass}
                required
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-green-600 p-3 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading && <Spinner />}
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full p-3 rounded border border-gray-600 text-gray-400 hover:text-white hover:border-white transition"
              >
                ← Back to form
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-600" />
            <span className="mx-3 text-gray-400 text-sm">Already have an account?</span>
            <hr className="flex-1 border-gray-600" />
          </div>
          <div className="text-center">
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Divider with logo */}
      <div className="hidden md:flex flex-col items-center justify-center relative w-24 bg-gray-900">
        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-500" />
        <img src={tnLogo} alt="Logo" className="w-20 h-20 z-10 bg-gray-800 rounded-full p-2" />
      </div>

      {/* Right image */}
      <div className="md:w-1/2 hidden md:block">
        <img src={phoneImg} alt="Phone" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}