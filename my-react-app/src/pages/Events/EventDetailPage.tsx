import React from "react";
import { useParams, Link } from "react-router-dom";
import mockEvents from "../../data/mockEvents.json";


type EventItem = {
  id: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  status?: "live" | "upcoming" | "ended" | string;
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = (mockEvents as EventItem[]).find(e => String(e.id) === String(id));

  if (!event) {
    return (
      <main className="content">
        <article className="card">
          <h2>Event not found</h2>
          <p>We couldn't find this event.</p>
          <Link className="backlink" to="/Home">← Back to home</Link>
        </article>
      </main>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>{event.title}</h1>
          <h2>All details of this event</h2>
        </div>
      </section>

      <main className="content">
        <article className="card event-detail">
          {event.imageUrl && (
            <img
              className="banner"
              src={event.imageUrl}
              alt={event.title}
              loading="lazy"
            />
          )}

          <div className="meta">
            {event.date && (
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            )}
            {(event.startTime || event.endTime) && (
              <p><strong>Time:</strong> {event.startTime}–{event.endTime}</p>
            )}
            {event.location && (
              <p><strong>Location:</strong> {event.location}</p>
            )}
            {event.status && (
              <p><strong>Status:</strong> {event.status}</p>
            )}
          </div>

          {event.description && (
            <>
              <h3>Description</h3>
              <p>{event.description}</p>
            </>
          )}

          <div className="actions">
            <Link to="/register">
                <button type="button">Registreren</button>
            </Link>
            <Link to="/Home">
                <button type="button">Cansel</button>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default EventDetailPage;
