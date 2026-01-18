import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../features/auth/authApi";
import { useAuth } from "../../features/auth/AuthProvider";
import "./DemoLoginPage.css";

type DemoRole = {
  role: string;
  email: string;
  password: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
};

const demoRoles: DemoRole[] = [
  {
    role: "player",
    email: "player@test.com",
    password: "123456",
    name: "Player",
    icon: "🎮",
    description: "Experience the event platform as a player",
    features: ["Browse events", "Add favorites", "View profile", "Join teams"],
  },
  {
    role: "manager",
    email: "manager@test.com",
    password: "123456",
    name: "Manager",
    icon: "📊",
    description: "Manage teams and organize events",
    features: ["Manage teams", "Organize events", "View analytics", "Player oversight"],
  },
  {
    role: "admin",
    email: "admin@test.com",
    password: "123456",
    name: "Admin",
    icon: "👑",
    description: "Full dashboard access with admin controls",
    features: ["Admin dashboard", "User management", "Event control", "Full access"],
  },
];

export default function DemoLoginPage() {
  const { setFromLoginResponse } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleDemoLogin(demo: DemoRole) {
    setLoading(demo.role);
    setErr(null);

    try {
      const res = await login({ 
        email: demo.email, 
        password: demo.password 
      });
      setFromLoginResponse(res);
      nav(location.state?.from ?? "/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
      setLoading(null);
    }
  }

  return (
    <section className="demo-login">
      <div className="demo-login__container">
        {/* Header */}
        <div className="demo-login__header">
          <h1 className="demo-login__title">Event Manager Demo</h1>
          <p className="demo-login__subtitle">
            Choose a role to explore the platform
          </p>
        </div>

        {/* Role Cards */}
        <div className="demo-login__roles">
          {demoRoles.map((demo) => (
            <button
              key={demo.role}
              onClick={() => handleDemoLogin(demo)}
              disabled={loading !== null}
              className={`demo-role-card ${loading === demo.role ? "loading" : ""}`}
            >
              <div className="demo-role-card__icon">{demo.icon}</div>
              <h3 className="demo-role-card__name">{demo.name}</h3>
              <p className="demo-role-card__description">{demo.description}</p>
              
              <ul className="demo-role-card__features">
                {demo.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <div className="demo-role-card__button">
                {loading === demo.role ? (
                  <span>Logging in...</span>
                ) : (
                  <span>Login as {demo.name}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {err && <p className="demo-login__error">{err}</p>}

        {/* Info Banner */}
        <div className="demo-login__info">
          <p className="demo-login__info-text">
            <strong>Demo Mode:</strong> This is a shared demonstration. All users see the same data.
            Feel free to explore - the database resets periodically.
          </p>
        </div>

        {/* Back Link */}
        <div className="demo-login__footer">
          <a href="/" className="demo-login__back">
            ← Back to Portfolio
          </a>
          <span className="demo-login__divider">|</span>
          <a href="/login/manual" className="demo-login__back">
            Use Manual Login
          </a>
        </div>
      </div>
    </section>
  );
}
