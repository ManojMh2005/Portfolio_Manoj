import React, { useEffect, useState } from "react";
import { LogOut, Mail, Download, MessageSquare } from "lucide-react";
import {
  adminLogin, adminLogout, watchAuth,
  subscribeToMessages, subscribeToResumeStats,
} from "../firebase.js";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email, password);
    } catch (err) {
      setError("Login failed — check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>Admin</h1>
        <p className="sub">Sign in with the account created in Firebase Authentication.</p>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && <div className="error-text">{error}</div>}
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  const [messages, setMessages] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    const unsubMsgs = subscribeToMessages(setMessages);
    const unsubStats = subscribeToResumeStats(setResumeCount);
    return () => { unsubMsgs(); unsubStats(); };
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div className="logo"><span className="logo-mark">M</span>Admin dashboard</div>
        <button className="btn btn-ghost" onClick={() => adminLogout()}><LogOut size={15} />Sign out</button>
      </div>
      <div className="admin-body">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="num">{messages.length}</div>
            <div className="label"><MessageSquare size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />Contact messages</div>
          </div>
          <div className="admin-stat-card">
            <div className="num">{resumeCount}</div>
            <div className="label"><Download size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />Resume downloads</div>
          </div>
        </div>

        <h2 className="section-title" style={{ fontSize: 20, marginBottom: 20 }}>Messages</h2>
        {messages.length === 0 && <p style={{ color: "var(--text-mute)" }}>No messages yet.</p>}
        {messages.map((m) => (
          <div className="message-row" key={m.id}>
            <div className="top">
              <div>
                <span className="name">{m.name}</span>{" "}
                <span className="email"><Mail size={12} style={{ verticalAlign: "-1px" }} /> {m.email}</span>
              </div>
              <span className="time">{m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : "just now"}</span>
            </div>
            <div className="body">{m.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => watchAuth(setUser), []);

  return (
    <div className="admin-shell">
      {user === undefined ? null : user ? <Dashboard user={user} /> : <LoginScreen />}
    </div>
  );
}
