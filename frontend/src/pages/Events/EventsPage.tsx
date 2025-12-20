import React from "react";
import { Link, useParams } from "react-router-dom";
import mockEvents from "../../shared/mockdata/mockEvents.json";
import { useFavourites } from "../../pages/Events/components/FavouritesContext";
import { useAuth } from "../../features/auth/AuthProvider";




type EventItem = {
  id: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  detail?: string;
  status?: "live" | "upcoming" | "ended" | string;
};

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = (mockEvents as EventItem[]).find(e => String(e.id) === String(id));
  const {isLiked, toggle} = useFavourites();
  const liked = isLiked(String(event?.id));
  const { user } = useAuth()

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
              <p>{event.detail}</p>
            </>
          )}
          <div className="actions">
              <Link to="/register">
                <button type="button">{user ? "sign up" : "Login"}</button>
              </Link>
            <Link to="/Home">
              <button type="button">Cancel</button>
            </Link>
          </div>
          { user && ( 
            <button
                type="button"
                className={`fav-btn fav-bottom-right ${liked ? "is-liked" : ""}`}
                aria-pressed={isLiked(event.id)}
                aria-label={isLiked(event.id) ? "Remove from favorites" : "Add to favorites"}
                title={isLiked(event.id) ? "Remove from favorites" : "Add to favorites"}
                onClick={() => toggle(event.id)}
                >
                <svg
                width="20"
                height="20"
                viewBox="0 0 24 20"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                >
                <path d="M12 21s-6.7-4.35-10-9.33C-1.1 6.74 2.13 2 6.5 2 8.87 2 10.5 3.5 12 5.09 13.5 3.5 15.13 2 17.5 2 21.87 2 25.1 6.74 22 11.67 18.7 16.65 12 21 12 21z" />
                </svg>
            </button>
          )}
        </article>
      </main>
    </>
  );
};

export default EventsPage;
