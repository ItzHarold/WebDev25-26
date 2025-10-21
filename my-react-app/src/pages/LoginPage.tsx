import { useEffect, useRef } from "react";

export default function LoginPage() {
    const pwdRef = useRef<HTMLInputElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const pwd = pwdRef.current;
        const toggle = toggleRef.current;
        const onToggle = () => {
            if (pwd) pwd.type = pwd.type === "password" ? "text" : "password";
        };
        toggle?.addEventListener("click", onToggle);

        return () => toggle?.removeEventListener("click", onToggle);
    }, []);

    return (
        <>
            <section className="hero">
                <h1>Login</h1>
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

                    <div className="row">
                        <button className="btn">Submit</button>
                        <a href="/register" className="muted">
                            No account? Click here to register
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
