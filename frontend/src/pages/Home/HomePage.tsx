import React, { useEffect, useState } from "react";
import { useFetchTeams } from "../../shared/hooks/useFetchTeams";
import { useFetchEvents } from "../../shared/hooks/useFetchEvents";
import EventGrid from "./components/EventGrid";
import Leaderboard from "./components/LeaderBoardList";
import TeamList from "./components/TeamList";
import PageHero from "../../shared/ui/PageHero";
import "../../shared/styles/global.css"
import "./HomePage.css";

const HomePage: React.FC = () => {
    const { teams, loading: teamsLoading, error: teamsError } = useFetchTeams();
    const { events } = useFetchEvents();
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        console.log("Active filter:", activeFilter);
        console.log("Events:", events);
        const filterEvents = () => {
            if (activeFilter === "all") {
                setFilteredEvents(events);
            } else {
                setFilteredEvents(events.filter((event) => event.status.toLowerCase() === activeFilter));
            }
        };

        filterEvents();
    }, [events, activeFilter]);
    return (
        <>
            <PageHero
                        title="Home"
                        subtitle="Overview of Events and Teams"
                        backgroundImageUrl="HeroStock.jpg"
                      />
            <main className="main-content">
                {/* Teams Section */}
                <aside className="teams-sidebar">
                    <h2>Teams</h2>
                    {teamsLoading && <p>Loading teams...</p>}
                {teamsError && <p style={{ color: "red" }}>{teamsError}</p>}
                {!teamsLoading && !teamsError && <TeamList teams={teams} />}
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
                    {teamsLoading && <p>Loading leaderboard...</p>}
                {teamsError && <p style={{ color: "red" }}>{teamsError}</p>}
                {!teamsLoading && !teamsError && <Leaderboard teams={teams} />}
                </aside>
            </main>
        </>
    );
};

export default HomePage;
