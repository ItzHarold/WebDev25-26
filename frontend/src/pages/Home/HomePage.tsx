import "../../shared/styles/global.css"
import "./HomePage.css";
import React, { useEffect, useState } from "react";
import EventGrid from "./components/EventGrid";
import Leaderboard from "./components/LeaderBoardList";
import TeamList from "./components/TeamList";
import mockEvents from "../../shared/mockdata/mockEvents.json";
import PageHero from "../../shared/ui/PageHero";
import { fetchTeams } from "../../shared/api/teamApi";


const HomePage: React.FC = () => {
    const [events] = useState(mockEvents);
    const [teams, setTeams] = useState([]);
    const [leaderboard, setLeaderboard] = useState([{ rank: 0, teamName: "", points: 0 },]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchTeams();
                setTeams(data);
                const sortedLeaderboard = [...data]
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 5)
                    .map((team, index) => ({
                        rank: index + 1,
                        teamName: team.description,
                        points: team.points,
                    }));
                    setLeaderboard(sortedLeaderboard);
            } catch (err: any) {
                setError(err.message || "Teams are still being updated try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadData();}, []);
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
                        backgroundImageUrl="HeroStock.jpg"
                      />
            <main className="main-content">
                {/* Teams Section */}
                <aside className="teams-sidebar">
                    <h2>Teams</h2>
                    {loading && <p>Loading teams...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && <TeamList teams={teams} />}
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
                    {loading && <p>Loading leaderboard...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && <Leaderboard data={leaderboard} />}
                </aside>
            </main>
        </>
    );
};

export default HomePage;
