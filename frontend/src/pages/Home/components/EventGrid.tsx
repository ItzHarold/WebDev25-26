// components/HomePage/EventGrid.tsx
import React from "react";
import EventCard from "./EventCard";

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    description: string;
    status: string;
    imageUrl?: string;
}

interface EventGridProps {
    events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
    if (events.length === 0) {
        return (<p>No events available.</p>)
    };

    return (
        <section className="events-grid">
            <ul>
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
            </ul>
        </section>
    );
};


export default EventGrid;