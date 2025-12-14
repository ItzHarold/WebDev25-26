// ===============================================
// src/pages/Register/RegisterPage.tsx
// Use DOB from registration and persist it
// ===============================================
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Role } from "../../context/AuthContext";

const MONTHS = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

function monthToIndex(m: string): number | null {
    const s = m.trim().toLowerCase();
    let i = MONTHS.indexOf(s);
    if (i >= 0) return i;
    const n = Number(s);
    if (Number.isInteger(n) && n >= 1 && n <= 12) return n - 1;
    return null;
}

export default function RegisterPage() {
    const pwdRef = useRef<HTMLInputElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    const [role, setRole] = useState<Role>(
        (localStorage.getItem("prefRole") as Role) || "player"
    );

    const [email, setEmail] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        const pwd = pwdRef.current;
        const toggle = toggleRef.current;
        const onToggle = () => { if (pwd) pwd.type = pwd.type === "password" ? "text" : "password"; };
        toggle?.addEventListener("click", onToggle);
        return () => toggle?.removeEventListener("click", onToggle);
    }, []);

    function buildIsoDob(): string | null {
        const di = Number(day);
        const yi = Number(year);
        const mi = monthToIndex(month);
        if (!Number.isInteger(di) || di < 1 || di > 31) return null;
        if (!Number.isInteger(yi) || yi < 1900 || yi > 2100) return null;
        if (mi === null) return null;
        const d = new Date(yi, mi, di);
        if (isNaN(d.getTime())) return null;
        const mm = String(mi + 1).padStart(2, "0");
        const dd = String(di).padStart(2, "0");
        return `${yi}-${mm}-${dd}`;
    }

    const handleSubmit = () => {
        setErr("");

        if (!email.trim()) {
            setErr("Please enter an email.");
            return;
        }
        const isoDob = buildIsoDob();
        if (!isoDob) {
            setErr("Please provide a valid date of birth (day / month / year).");
            return;
        }

        localStorage.setItem("prefRole", role);
        localStorage.setItem("profile:birthday", isoDob);
        localStorage.setItem("profile:email", email.trim());

        alert(`Registered as ${role.toUpperCase()} (demo). Continue to Login.`);
    };

    return (
        <>
            <section className="hero">
                <h1>Register</h1>
            </section>

            <main className="card">
                <div className="stack">
                    {/* Role selector */}
                    <div className="row" style={{ gap: 12 }}>
                        <label className="chip" style={{ cursor: "pointer", padding: "8px 14px" }}>
                            <input
                                type="radio"
                                name="role"
                                value="player"
                                checked={role === "player"}
                                onChange={() => setRole("player")}
                                style={{ marginRight: 8 }}
                            />
                            Player
                        </label>
                        <label className="chip" style={{ cursor: "pointer", padding: "8px 14px" }}>
                            <input
                                type="radio"
                                name="role"
                                value="manager"
                                checked={role === "manager"}
                                onChange={() => setRole("manager")}
                                style={{ marginRight: 8 }}
                            />
                            Manager
                        </label>
                    </div>

                    <label className="input">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="input" style={{ paddingRight: 130 }}>
                        <input id="password" ref={pwdRef} type="password" placeholder="Enter password" />
                        <button id="toggle" ref={toggleRef} type="button" className="pill-toggle">
                            show / hide
                        </button>
                    </label>

                    <label className="input">
                        <input type="password" placeholder="Confirm password" />
                    </label>

                    <div className="dob">
                        <label className="dob-label">Date of birth</label>
                        <input
                            className="chip"
                            type="text"
                            inputMode="numeric"
                            placeholder="day"
                            maxLength={2}
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        />
                        <input
                            className="chip"
                            type="text"
                            placeholder="month"
                            maxLength={9}
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                        <input
                            className="chip"
                            type="text"
                            inputMode="numeric"
                            placeholder="year"
                            maxLength={4}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>

                    {err && <p style={{ color: "#e11d48", marginTop: 4 }}>{err}</p>}

                    <div className="row">
                        <button className="btn" type="button" onClick={handleSubmit}>Submit</button>
                        <Link to="/Login" className="muted">Already registered? Click here to log in</Link>
                    </div>
                </div>
            </main>
        </>
    );
}
