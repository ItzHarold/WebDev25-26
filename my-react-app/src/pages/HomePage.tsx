import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <>
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
                            <p className="meta">Rotterdam • May 10–12, 2025</p>
                            <p className="desc">Short description of the event. A quick summary that fits two lines.</p>
                            <Link to="/Events"><button className="btn">View Details</button></Link>
                        </div>
                    </article>

                    <article className="event-card">
                        <div className="card-media"></div>
                        <div className="card-body">
                            <h3>Sample Event Two</h3>
                            <p className="meta">Rotterdam • June 20–22, 2025</p>
                            <p className="desc">Short description for the second event. Keep copy brief.</p>
                            <Link to="/Events"><button className="btn">View Details</button></Link>
                        </div>
                    </article>

                    <article className="event-card">
                        <div className="card-media"></div>
                        <div className="card-body">
                            <h3>Sample Event Three</h3>
                            <p className="meta">Rotterdam • June 20–22, 2025</p>
                            <p className="desc">Short description for the second event. Keep copy brief.</p>
                            <Link to="/Events"><button className="btn">View Details</button></Link>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
};

export default HomePage;
