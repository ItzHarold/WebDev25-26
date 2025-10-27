import React, { useState } from "react";
import EventGrid from "../../components/HomePage/EventGrid";
import Leaderboard from "../../components/HomePage/LeaderBoardList";
import TeamList from "../../components/HomePage/TeamList";
import mockEvents from "../../data/mockEvents.json";
import mockLeaderboard from "../../data/mockLeaderboard.json";
import mockTeams from "../../data/mockTeams.json";

const HomePage: React.FC = () => {
    const [events] = useState(mockEvents);
    const [teams] = useState(mockTeams);
    const [leaderboard] = useState(mockLeaderboard);
    const [activeFilter, setActiveFilter] = useState("all");
    const filteredEvents = events.filter(event => {
        if (activeFilter === 'all') {
            return true;
        }

        return event.status === activeFilter;
    }
    );
    return (
        <>
            <div className="homepage">
                <section className="hero">
                    <div className="hero-content">
                        <h1>ESPORTS TOURNAMENTS</h1>
                        <h2>Discover upcoming events and tournaments. Click a card to view full details.</h2>
                    </div>
                </section>

                {/* Homepage Content*/}
                <div className="main-content">
                    {/*Teams Section*/}
                    <aside className="teams-sidebar">
                        <h2>Teams</h2>
                        <TeamList teams={teams} />
                    </aside>
                    {/* Event Section */}
                    <section className="event-section">
                        <div className="events-header">
                            <div className="events-title">
                                <h2>Events</h2>
                            </div>
                            <div className="event-filters" role="tablist" aria-label="Event status filters">
                                <button className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                                    onClick={() => setActiveFilter("all")}
                                >
                                    All
                                </button>
                                <button className={`filter-btn ${activeFilter === "live" ? "active" : ""}`}
                                    onClick={() => setActiveFilter("live")}
                                >
                                    Live
                                </button>
                                <button className={`filter-btn ${activeFilter === "upcoming" ? "active" : ""}`}
                                    onClick={() => setActiveFilter("upcoming")}
                                >
                                    Upcoming
                                </button>
                                <button className={`filter-btn ${activeFilter === "ended" ? "active" : ""}`}
                                    onClick={() => setActiveFilter("ended")}
                                >
                                    Ended
                                </button>
                            </div>
                        </div>
                        <EventGrid events={filteredEvents} />
                    </section>
                    {/*Leaderboard Section*/}
                    <aside className="teams-sidebar">
                        <h2>Leaderboard</h2>
                        <Leaderboard data={leaderboard} />
                    </aside>
                </div>
            </div>
        </>
    );
};

export default HomePage;
