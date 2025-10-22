import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const pwdRef = useRef<HTMLInputElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const pwd = pwdRef.current;
        const toggle = toggleRef.current;
        const onToggle = () => { if (pwd) pwd.type = pwd.type === "password" ? "text" : "password"; };
        toggle?.addEventListener("click", onToggle);
        return () => toggle?.removeEventListener("click", onToggle);
    }, []);

    return (
        <>
            <section className="hero">
                <h1>Register</h1>
            </section>

            <main className="card">
                <div className="stack">
                    <label className="input">
                        <input type="email" placeholder="Enter email" />
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
                        <input className="chip" type="text" inputMode="numeric" placeholder="day" maxLength={2} />
                        <input className="chip" type="text" placeholder="month" maxLength={9} />
                        <input className="chip" type="text" inputMode="numeric" placeholder="year" maxLength={4} />
                    </div>

                    <div className="row">
                        <button className="btn" type="button">Submit</button>
                        <Link to="/Login" className="muted">Already registered? Click here to log in</Link>
                    </div>
                </div>
            </main>
        </>
    );
}
