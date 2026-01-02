import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../features/auth/authApi";
import { useAuth } from "../../features/auth/AuthProvider";
import PageHero from "../../shared/ui/PageHero";
import "./LoginPage.css";

export default function LoginPage() {
  const { setFromLoginResponse } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const res = await login({ email, password });
      setFromLoginResponse(res);
      nav(location.state?.from ?? "/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    }
  }

  return (
    <section className="login">
      <PageHero
        title="Login"
        subtitle="Access your account"
        backgroundImageUrl="HeroStock.jpg"
      />

      <div className="login__card">
        <form className="login__form" onSubmit={onSubmit}>
          <label className="login__label" htmlFor="email">
            Email
          </label>
          <div className="login__input">
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <label className="login__label" htmlFor="password">
            Password
          </label>
          <div className="login__input">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {err && <p className="login__error">{err}</p>}

          <button type="submit" className="login__button">
            Login
          </button>
        </form>

        <p className="login__meta">
          No account?{" "}
          <Link className="login__link" to="/register">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
