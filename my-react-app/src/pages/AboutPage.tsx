import React from "react";
import "../styles/LightStyles/about.css";
import "../styles/DarkStyles/about.css";

const AboutPage: React.FC = () => {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>About ETM</h1>
                    <h2>Esports Team Management — built by students of Hogeschool Rotterdam</h2>
                </div>
            </section>

            <main className="content">
                <article className="card">
                    <h3>Who we are</h3>
                    <p>
                        ETM (Esports Team Management) is a school project created by four students at Hogeschool Rotterdam:
                    </p>
                    <ul className="people">
                        <li>Harold Ponte da Costa (1054428)</li>
                        <li>Jurwin Evertsz (1054598)</li>
                        <li>Sidi Mohamad Chattou (1055297)</li>
                        <li>Halit Erkam Özyasar (1078244)</li>
                    </ul>

                    <h3>What we’re building</h3>
                    <p>
                        We’re building an application where players and managers can view upcoming esports events and the details
                        they need to participate. The platform supports different roles for players and managers. Players can join
                        teams managed by a team manager, while managers can manage rosters, view team information, and sign teams
                        up for events.
                    </p>
                </article>
            </main>
        </>
    );
};

export default AboutPage;
