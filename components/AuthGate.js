import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ROLES = [
  { key: 'donor', icon: '🩸', title: 'I want to Donate Blood', text: 'Get matched with nearby urgent requests.' },
  { key: 'requester', icon: '🚨', title: 'I need Blood / Searching for Donors', text: 'Find compatible donors and blood banks.' },
  { key: 'blood_bank', icon: '🏥', title: 'I represent a Blood Bank / Hospital', text: 'Manage verified inventory and donor check-ins.' }
];

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('login');
  const [roleStep, setRoleStep] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function loadProfile(currentSession) {
    if (!currentSession) { setProfile(null); setLoading(false); return; }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', currentSession.user.id).maybeSingle();
    if (error) setError(error.message);
    setProfile(data);
    setRoleStep(!!data && (!data.role || data.role === 'recipient') && !currentSession.user.user_metadata?.roleChosen);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); loadProfile(data.session); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next);
      loadProfile(next);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submit(e) {
    e.preventDefault(); setError(''); setMessage('');
    if (form.password.length < 6) return setError('Password must contain at least 6 characters.');
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } }
      });
      if (error) return setError(error.message);
      if (!data.session) setMessage('Account created. Check your email to verify your account, then log in.');
      else setRoleStep(true);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) return setError(error.message);
      await loadProfile(data.session);
    }
  }

  async function resetPassword() {
    if (!form.email) return setError('Enter your email first.');
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: `${window.location.origin}/` });
    if (error) setError(error.message); else setMessage('Password reset instructions have been sent to your email.');
  }

  async function chooseRole(role) {
    setError('');
    const { error } = await supabase.rpc('set_my_role', { p_role: role });
    if (error) return setError(error.message);
    await supabase.auth.updateUser({ data: { roleChosen: true, selected_role: role } });
    await loadProfile(session);
    setRoleStep(false);
  }

  if (loading) return <div className="splash"><div className="pulse-ring"><div className="drop">✚</div></div><h1>Rakto<span>Setu</span></h1><p>Connecting securely...</p><div className="loader"><i/><i/><i/></div></div>;

  if (!session) return <main className="auth-shell"><div className="auth-card"><div className="brand auth-brand"><span className="brand-mark">✚</span><span>Rakto<span>Setu</span></span></div><span className="eyebrow">SECURE BLOOD CONNECTION</span><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="lead">{mode === 'login' ? 'Sign in to continue to your blood support dashboard.' : 'Create a secure account to donate or request blood.'}</p><form onSubmit={submit}>{mode === 'signup' && <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"/></label>}<label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></label>{error && <div className="auth-error">{error}</div>}{message && <div className="auth-message">{message}</div>}<button className="primary full" type="submit">{mode === 'login' ? 'Log In →' : 'Create Account →'}</button></form>{mode === 'login' && <button className="text-button" onClick={resetPassword}>Forgot password?</button>}<div className="auth-switch">{mode === 'login' ? <>New to RaktoSetu? <button onClick={()=>{setMode('signup');setError('');setMessage('')}}>Create account</button></> : <>Already have an account? <button onClick={()=>{setMode('login');setError('');setMessage('')}}>Log in</button></>}</div></div></main>;

  if (roleStep) return <main className="auth-shell"><div className="auth-card role-auth"><span className="eyebrow">ONE LAST STEP</span><h1>How will you use RaktoSetu?</h1><p className="lead">Choose your primary role. You can access the appropriate dashboard after setup.</p><div className="role-grid">{ROLES.map(r=><button key={r.key} className="role-card" onClick={()=>chooseRole(r.key)}><span className="role-icon">{r.icon}</span><span><strong>{r.title}</strong><small>{r.text}</small></span><b>›</b></button>)}</div>{error && <div className="auth-error">{error}</div>}</div></main>;

  return children;
}
