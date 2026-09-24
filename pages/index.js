import { useEffect, useState } from 'react';

const roles = [
  { key: 'donor', icon: '🩸', title: 'I want to Donate Blood', text: 'Get matched with nearby urgent requests.' },
  { key: 'requester', icon: '🚨', title: 'I need Blood', text: 'Find compatible donors and blood banks.' },
  { key: 'blood_bank', icon: '🏥', title: 'I represent a Blood Bank / Hospital', text: 'Manage verified inventory and donor check-ins.' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('home');
  const [role, setRole] = useState(null);
  const [available, setAvailable] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Go home">
          <span className="brand-mark">✚</span><span>Rakto<span>Setu</span></span>
        </button>
        <button className="profile" onClick={() => setScreen('profile')}>Profile</button>
      </header>

      {screen === 'home' && <HomeScreen setScreen={setScreen} setRole={setRole} />}
      {screen === 'role' && <RoleScreen role={role} setRole={setRole} setScreen={setScreen} />}
      {screen === 'request' && <RequestScreen submitted={submitted} setSubmitted={setSubmitted} setScreen={setScreen} />}
      {screen === 'donor' && <DonorScreen available={available} setAvailable={setAvailable} setScreen={setScreen} />}
      {screen === 'blood_bank' && <BankScreen setScreen={setScreen} />}
      {screen === 'profile' && <ProfileScreen setScreen={setScreen} />}

      <nav className="bottom-nav">
        <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>⌂<small>Home</small></button>
        <button onClick={() => role === 'donor' ? setScreen('donor') : setScreen('request')}>◉<small>Requests</small></button>
        <button>◷<small>History</small></button>
        <button onClick={() => setScreen('profile')}>◯<small>Profile</small></button>
      </nav>
    </main>
  );
}

function Loading() {
  return <div className="splash"><div className="pulse-ring"><div className="drop">✚</div></div><h1>Rakto<span>Setu</span></h1><p>Blood. Connected.</p><div className="loader"><i/><i/><i/></div></div>;
}

function HomeScreen({ setScreen, setRole }) {
  return <section className="content hero">
    <div className="eyebrow">TRUSTED BLOOD CONNECTION</div>
    <h2>Every drop can make a <em>difference.</em></h2>
    <p className="lead">Connect donors, patients, hospitals and verified blood banks when every minute matters.</p>
    <div className="hero-actions">
      <button className="primary" onClick={() => { setRole('requester'); setScreen('request'); }}>Request Blood <span>→</span></button>
      <button className="secondary" onClick={() => { setRole('donor'); setScreen('donor'); }}>Donate Blood</button>
    </div>
    <div className="stats"><div><strong>24/7</strong><span>Emergency support</span></div><div><strong>15 km</strong><span>Matching radius</span></div><div><strong>3</strong><span>Verified roles</span></div></div>
    <div className="section-head"><div><span className="eyebrow">YOUR EXPERIENCE</span><h3>Choose how you help</h3></div></div>
    <div className="role-grid">{roles.map(r => <button key={r.key} className="role-card" onClick={() => { setRole(r.key); setScreen(r.key === 'requester' ? 'request' : r.key); }}><span className="role-icon">{r.icon}</span><span><strong>{r.title}</strong><small>{r.text}</small></span><b>›</b></button>)}</div>
  </section>;
}

function RoleScreen({ setScreen, setRole }) { return <section className="content"><span className="eyebrow">WELCOME TO RAKTOSETU</span><h2>How would you like to use RaktoSetu?</h2>{roles.map(r => <button className="role-card" key={r.key} onClick={() => { setRole(r.key); setScreen(r.key === 'requester' ? 'request' : r.key); }}><span className="role-icon">{r.icon}</span><span><strong>{r.title}</strong><small>{r.text}</small></span><b>›</b></button>)}</section>; }

function RequestScreen({ submitted, setSubmitted, setScreen }) {
  if (submitted) return <section className="content success"><div className="success-icon">✓</div><span className="eyebrow">REQUEST SENT</span><h2>Finding compatible donors near you.</h2><p>We’re notifying eligible donors and verified blood banks. You can track responses in real time.</p><div className="tracker"><div className="done">✓ Request created</div><div className="active-dot">● Donors being notified</div><div>○ Donor accepted</div><div>○ On the way</div><div>○ Completed</div></div><button className="primary" onClick={() => setScreen('home')}>Back to Home</button></section>;
  return <section className="content"><button className="back" onClick={() => setScreen('home')}>← Back</button><span className="eyebrow">EMERGENCY BLOOD REQUEST</span><h2>Request Blood</h2><p className="lead">Tell us what is needed. We'll search for compatible help nearby.</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}><label>Patient name<input required placeholder="Enter patient name" /></label><label>Emergency contact<input required type="tel" placeholder="Phone number" /></label><label>Required blood group<select required defaultValue=""><option value="" disabled>Select blood group</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(x => <option key={x}>{x}</option>)}</select></label><label>Units needed<input required type="number" min="1" max="20" defaultValue="1" /></label><div className="two"><label>Hospital name<input required placeholder="Hospital / blood bank" /></label><label>Room / Ward<input placeholder="e.g. Ward 4B" /></label></div><label>Hospital address<input required placeholder="Search or enter address" /></label><label>Urgency<div className="urgency"><button type="button" className="standard">Standard</button><button type="button" className="urgent">Urgent</button><button type="button" className="emergency">Emergency</button></div></label><label>Medical notes <span>(optional)</span><textarea placeholder="Surgery, accident, or other relevant details" /></label><button className="primary full" type="submit">Find Compatible Donors →</button></form></section>;
}

function DonorScreen({ available, setAvailable, setScreen }) { return <section className="content"><div className="dash-title"><div><span className="eyebrow">DONOR DASHBOARD</span><h2>Ready to help?</h2></div><div className={`toggle ${available ? 'on' : ''}`} onClick={() => setAvailable(!available)}><span/></div></div><div className="availability"><span>Available to Donate Now</span><strong>{available ? 'ON' : 'OFF'}</strong></div><div className="card"><div className="card-head"><span>🚨 Urgent requests near you</span><small>Within 15 km</small></div><h3>O+ blood needed</h3><p>City Hospital · 3.2 km away</p><div className="request-meta"><b>2 units</b><b className="danger">Emergency</b></div><div className="row"><button className="primary" onClick={() => alert('Accept flow ready for backend connection')}>Accept & Contact</button><button className="ghost">Decline</button></div></div><div className="grid2"><div className="mini"><span>Last donation</span><strong>12 Jun 2026</strong></div><div className="mini"><span>Next eligible</span><strong>07 Aug 2026</strong></div></div><button className="secondary full" onClick={() => setScreen('profile')}>View Donation History</button></section>; }

function BankScreen({ setScreen }) { const stock=[['A+','12'],['A-','3'],['B+','18'],['B-','2'],['AB+','7'],['AB-','2'],['O+','15'],['O-','1']]; return <section className="content"><span className="eyebrow">VERIFIED ORGANIZATION</span><h2>Blood Bank Dashboard</h2><div className="verified">✓ Verified Blood Bank <small>Inventory updates are timestamped</small></div><div className="inventory">{stock.map(([g,n]) => <div key={g}><strong>{g}</strong><span className={+n < 3 ? 'low' : ''}>{n} units</span><button>Update</button></div>)}</div><button className="primary full">+ Add Stock</button><button className="secondary full" onClick={() => setScreen('home')}>Back to Home</button></section>; }

function ProfileScreen({ setScreen }) { return <section className="content"><span className="eyebrow">ACCOUNT</span><h2>Profile & Privacy</h2><div className="profile-card"><div className="avatar">JD</div><div><strong>Jordan Alvarez</strong><span>Donor · O+ · Verified</span></div></div>{['Personal information','Location permissions','Notifications','Privacy Policy','Delete account & data'].map((x,i)=><button className="settings" key={x}><span>{x}</span><b>›</b></button>)}<button className="secondary full" onClick={() => setScreen('home')}>Back to Home</button></section>; }
