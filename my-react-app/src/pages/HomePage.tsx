
import React from "react";
import TopBar from "../components/topbar";
import "../styles/base.css";
import "../styles/darkmode.css";
import "../styles/home.css";
import "../styles/topbar.css";

const HomePage: React.FC = () => {
    const Testbtn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        alert("Sorry, Registration is Closed");
    };

    return (
        <>
            <head>
                <title>Wireframe Layout</title>
                <link rel="stylesheet" href="../shared/base.css"></link>
                <link rel="stylesheet" href="../shared/topbar.css"></link>
                <link rel="stylesheet" href="../shared/darkmode.css"></link>
                <link rel="stylesheet" href="home.css"></link>
            </head>

            <body>
                <button id="darkModeBtn">🌙 Dark Mode</button>
                <script src="../Shared/darkmode.js" defer></script>

                <div id="topbar"></div>
                <script src="../Shared/topbar.js" defer></script>

                <section className="hero">
                    <div className="hero-content">
                        <h1>ESPORTS TOURNAMENTS</h1>
                        <h2>Discover upcoming events and tournaments. Click a card to view full details.</h2>
                    </div>
                </section>

                <section className="events">
                    <div className="events-header">
                        <div className="events-title">
                            <h2>Events</h2>
                        </div>
                        <div className="event-filters" role="tablist" aria-label="Event status filters">
                            <button className="filter-btn active" data-filter="all">All</button>
                            <button className="filter-btn" data-filter="live">Live</button>
                            <button className="filter-btn" data-filter="upcoming">Upcoming</button>
                            <button className="filter-btn" data-filter="ended">Ended</button>
                        </div>
                    </div>

                    <div className="events-grid">

                        <article className="event-card">
                            <div className="card-media"></div>
                            <div className="card-body">
                                <h3>Sample Event One</h3>
                                <p className="meta">Rotterdam • May 10-12, 2025</p>
                                <p className="desc">Short description of the event. A quick summary that fits two lines.</p>
                                <button onClick={Testbtn}>View Details</button>
                                <link></link>
                            </div>
                        </article>

                        <article className="event-card">
                            <div className="card-media"></div>
                            <div className="card-body">
                                <h3>Sample Event Two</h3>
                                <p className="meta">Rotterdam • June 20-22, 2025</p>
                                <p className="desc">Short description for the second event. Keep copy brief.</p>
                                <a id="" className="btn" href="../Events/Events.html">View Details</a>
                            </div>
                        </article>
                        <article className="event-card">
                            <div className="card-media"></div>
                            <div className="card-body">
                                <h3>Sample Event Three</h3>
                                <p className="meta">Rotterdam • June 20-22, 2025</p>
                                <p className="desc">Short description for the second event. Keep copy brief.</p>
                                <a id="" className="btn" href="../Events/Events.html">View Details</a>
                            </div>
                        </article>
                    </div>
                    <div id="eventModal" className="modal">
                        <div className="mdlcontent">
                            <a id="xbtn" className="xbutton" href="">❌</a>
                            <iframe id="eventFrame" src="" width="100%" height="800"></iframe>
                        </div>
                    </div>
                </section>

                <script src="../Home/Home.js"></script>
            </body>
        </>
    );
};

export default HomePage;