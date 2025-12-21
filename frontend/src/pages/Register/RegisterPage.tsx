import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "../../shared/ui/PageHero";
import { register } from "../../features/auth/authApi";
import { useAuth } from "../../features/auth/AuthProvider";
import "./RegisterPage.css";

type Role = "player" | "manager";

export default function RegisterPage() {
  const { setFromLoginResponse } = useAuth();
  const nav = useNavigate();

  const [role, setRole] = useState<Role>("player");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!firstName.trim()) return setErr("First name is required.");
    if (!lastName.trim()) return setErr("Last name is required.");
    if (!userName.trim()) return setErr("Username is required.");
    if (!email.trim()) return setErr("Email is required.");
    if (!dob) return setErr("Date of birth is required.");
    if (!password) return setErr("Password is required.");
    if (password !== confirmPassword) return setErr("Passwords do not match.");

    try {
      const res = await register({
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userName: userName.trim(),
        email: email.trim(),
        password,
        dob,
      });

      setFromLoginResponse(res);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Register failed");
    }
  }

  return (
    <section className="register">
      <PageHero title="Register" subtitle="Create your account" backgroundImageUrl="HeroStock.jpg" />

      <div className="register__card">
        <form className="register__form" onSubmit={onSubmit}>
          <fieldset className="register__fieldset">
            <legend className="register__legend">Role</legend>

            <label className="register__radio">
              <input
                type="radio"
                name="role"
                value="player"
                checked={role === "player"}
                onChange={() => setRole("player")}
              />
              <span>Player</span>
            </label>

            <label className="register__radio">
              <input
                type="radio"
                name="role"
                value="manager"
                checked={role === "manager"}
                onChange={() => setRole("manager")}
              />
              <span>Manager</span>
            </label>
          </fieldset>

          <label className="register__label" htmlFor="firstName">First name</label>
          <div className="register__input">
            <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
          </div>

          <label className="register__label" htmlFor="lastName">Last name</label>
          <div className="register__input">
            <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
          </div>

          <label className="register__label" htmlFor="userName">Username</label>
          <div className="register__input">
            <input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} autoComplete="username" />
          </div>

          <label className="register__label" htmlFor="email">Email</label>
          <div className="register__input">
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <label className="register__label" htmlFor="dob">Date of birth</label>
          <div className="register__input">
            <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>

          <label className="register__label" htmlFor="password">Password</label>
          <div className="register__input">
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>

          <label className="register__label" htmlFor="confirmPassword">Confirm password</label>
          <div className="register__input">
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </div>

          {err && <p className="register__error">{err}</p>}

          <button type="submit" className="register__button">
            Create account
          </button>
        </form>

        <p className="register__meta">
          Already registered?{" "}
          <Link className="register__link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
