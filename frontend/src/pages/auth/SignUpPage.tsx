import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "./AuthLayout";

export default function SignUpPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);
    if (result.error) setError(result.error);
    else setSuccess(true);
  };

  if (success) return (
    <AuthLayout>
      <div className="animate-fade-in text-center space-y-4">
        <div className="w-12 h-12 border-2 border-emerald-400 flex items-center justify-center mx-auto rounded-full bg-emerald-50">
          <span className="text-emerald-600 text-xl">✓</span>
        </div>
        <h2 className="font-bold text-2xl text-slate-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Account Created</h2>
        <p className="text-slate-500 text-sm">Check your email to confirm your account before signing in.</p>
        <Link to="/login" className="block mt-4 text-emerald-600 font-mono text-sm hover:text-emerald-500 font-bold">← Back to Sign In</Link>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="font-mono text-xs text-emerald-700 tracking-widest mb-2 font-bold">OPERATOR REGISTRATION</div>
          <h1 className="font-bold text-3xl text-slate-900 tracking-tight mb-2" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Create Operator Account</h1>
          <p className="text-slate-500 text-sm">Register for secure platform access.</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 border border-red-200 text-red-600 text-sm font-mono rounded bg-red-50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "FULL NAME", type: "text", value: name, set: setName, placeholder: "Operator Full Name" },
            { label: "EMAIL ADDRESS", type: "email", value: email, set: setEmail, placeholder: "operator@ibvap.gov.in" },
            { label: "PASSWORD", type: "password", value: password, set: setPassword, placeholder: "Min. 8 characters" },
            { label: "CONFIRM PASSWORD", type: "password", value: confirm, set: setConfirm, placeholder: "Repeat password" },
          ].map(({ label, type, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-mono text-slate-600 tracking-widest mb-1.5 font-bold">{label}</label>
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                required
                className="w-full px-3 py-2.5 text-sm text-slate-800 font-mono border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all rounded bg-slate-50"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 font-bold text-sm tracking-widest disabled:opacity-50 transition-all text-white rounded hover:shadow-lg"
            style={{ background: loading ? "#059669" : "#10b981", fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs font-mono">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full py-2.5 border border-slate-300 text-slate-600 text-sm font-mono tracking-wide hover:border-slate-400 hover:bg-slate-50 transition-all rounded flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <span className="text-slate-400 text-xs">Already have an account? </span>
          <Link to="/login" className="text-emerald-600 text-xs font-mono hover:text-emerald-500 transition-colors font-bold">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
