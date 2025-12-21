// src/pages/ContactPage.tsx
import React from "react";
import "./ContactPage.css";
import PageHero from "../../shared/ui/PageHero";

const ContactPage: React.FC = () => {
    return (
        <>
            <PageHero title="Contact Page" subtitle="Get in touch with the ETM team" backgroundImageUrl=""/>
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
