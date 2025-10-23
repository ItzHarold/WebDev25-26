import React, { useState } from "react";
import defaulticon from "../../assets/game.jpg";
import EventGrid from "../../components/HomePage/EventGrid";

const mockEvents = [
    {
        id: "1",
        title: "Sample Event One",
        location: "Rotterdam",
        date: "June 20–22, 2025",
        description: "Short description for the first event.",
        status: "Live" as const,
        imageUrl: defaulticon
    },
    {
        id: "2",
        title: "Sample Event Two",
        location: "Amsterdam",
        date: "June 20–22, 2025",
        description: "Short description for the Second event.",
        status: "upcoming" as const,
        imageUrl: defaulticon
    },
    {
        id: "3",
        title: "Sample Event Three",
        location: "Amsterdam",
        date: "June 20–22, 2025",
        description: "Short description for the Second event.",
        status: "Live" as const,
        imageUrl: defaulticon
    },
    {
        id: "3",
        title: "Sample Event Four",
        location: "Amsterdam",
        date: "June 20–22, 2025",
        description: "Short description for the Fourth event.",
        status: "Live" as const,
        imageUrl: defaulticon
    },
    {
        id: "5",
        title: "Sample Event Five",
        location: "Amsterdam",
        date: "June 20–22, 2026",
        description: "Short description for the Fifth event.",
        status: "upcoming" as const,
        imageUrl: defaulticon
    },
    {
        id: "6",
        title: "Sample Event Six",
        location: "Amsterdam",
        date: "June 20–22, 2022z",
        description: "Short description for the Sixth event.",
        status: "Ended" as const,
        imageUrl: defaulticon
    }

];

const HomePage: React.FC = () => {
    const [events] = useState(mockEvents);
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
                <EventGrid events={events} />
            </section>
        </>
    );
};

export default HomePage;
