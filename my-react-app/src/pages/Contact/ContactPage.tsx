// src/pages/ContactPage.tsx
import React from "react";
import "./DarkContact.css";
import "./DarkContact.css";

const ContactPage: React.FC = () => {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>Contact</h1>
                    <h2>Get in touch with the ETM team</h2>
                </div>
            </section>

            <main className="content">
                <article className="card">
                    <ul className="contacts">
                        <li>
                            <span className="name">Harold Ponte da Costa</span>
                            <a className="link" href="https://github.com/ItzHarold" target="_blank" rel="noreferrer">GitHub</a>
                        </li>
                        <li>
                            <span className="name">Jurwin Evertsz</span>
                            <a className="link" href="https://github.com/JurDev" target="_blank" rel="noreferrer">GitHub</a>
                        </li>
                        <li>
                            <span className="name">Sidi Mohamad Chattou</span>
                            <a className="link" href="https://github.com/Sidim9" target="_blank" rel="noreferrer">GitHub</a>
                        </li>
                        <li>
                            <span className="name">Halit Erkam Özyasar</span>
                            <a className="link" href="https://github.com/herkam3" target="_blank" rel="noreferrer">GitHub</a>
                        </li>
                    </ul>
                </article>
            </main>
        </>
    );
};

export default ContactPage;
