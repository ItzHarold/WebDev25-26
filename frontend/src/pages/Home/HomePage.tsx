import "./HomePage.css";
import React, { useState } from "react";
import EventGrid from "./components/EventGrid";
import Leaderboard from "./components/LeaderBoardList";
import TeamList from "./components/TeamList";
import mockEvents from "../../shared/mockdata/mockEvents.json";
import mockLeaderboard from "../../shared/mockdata/mockLeaderboard.json";
import mockTeams from "../../shared/mockdata/mockTeams.json";
import PageHero from "../../shared/ui/PageHero";


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
            <PageHero
                        title="Home"
                        subtitle="Overview of Events and Teams"
                        backgroundImageUrl="../../public/IronFist.png"
                      />
            <main className="main-content">
                {/* Teams Section */}
                <aside className="teams-sidebar">
                    <h2>Teams</h2>
                    <TeamList teams={teams} />
                </aside>

                {/* Event Section */}
                <section className="event-section">
                    <header className="events-header">
                        <h2 className="events-title">Events</h2>
                        <nav className="event-filters" role="tablist" aria-label="Event status filters">
                            <button
                                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                                onClick={() => setActiveFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${activeFilter === "live" ? "active" : ""}`}
                                onClick={() => setActiveFilter("live")}
                            >
                                Live
                            </button>
                            <button
                                className={`filter-btn ${activeFilter === "upcoming" ? "active" : ""}`}
                                onClick={() => setActiveFilter("upcoming")}
                            >
                                Upcoming
                            </button>
                            <button
                                className={`filter-btn ${activeFilter === "ended" ? "active" : ""}`}
                                onClick={() => setActiveFilter("ended")}
                            >
                                Ended
                            </button>
                        </nav>
                    </header>
                    <EventGrid events={filteredEvents} />
                </section>

                {/* Leaderboard Section */}
                <aside className="leaderboard-sidebar">
                    <h2>Leaderboard</h2>
                    <Leaderboard data={leaderboard} />
                </aside>
            </main>
        </>
    );
};

export default HomePage;
