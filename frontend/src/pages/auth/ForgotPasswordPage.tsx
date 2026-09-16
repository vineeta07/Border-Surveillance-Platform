import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "./AuthLayout";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.error) setError(result.error);
    else setSent(true);
  };

  return (
    <AuthLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="font-mono text-xs text-emerald-700 tracking-widest mb-2 font-bold">ACCESS RECOVERY</div>
          <h1 className="font-bold text-3xl text-slate-900 tracking-tight mb-2" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Recover Access</h1>
          <p className="text-slate-500 text-sm">Enter your registered email address to receive a reset link.</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="px-4 py-3 border border-emerald-200 text-emerald-700 text-sm font-mono rounded bg-emerald-50">
              Reset link sent to <strong>{email}</strong>. Check your inbox.
            </div>
            <Link to="/login" className="block text-center text-emerald-600 font-mono text-sm hover:text-emerald-500 mt-4 font-bold">← Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2 border border-red-200 text-red-600 text-sm font-mono rounded bg-red-50">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-slate-600 tracking-widest mb-1.5 font-bold">REGISTERED EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@ibvap.gov.in"
                required
                className="w-full px-3 py-2.5 text-sm text-slate-800 font-mono border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all rounded bg-slate-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 font-bold text-sm tracking-widest disabled:opacity-50 text-white rounded hover:shadow-lg transition-all"
              style={{ background: loading ? "#059669" : "#10b981", fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-emerald-600 font-mono text-xs hover:text-emerald-500 transition-colors font-bold">← Back to Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
