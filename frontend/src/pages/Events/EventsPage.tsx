import React from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../../shared/ui/PageHero";
import { useFetchEventByID } from "../../shared/hooks/useFetchEvents";
import "./EventsPage.css";
import FavouriteButton from "../Favourites/components/FavouriteButton";
import { useFavouritesBackend } from "../Favourites/components/useFavouritesBackend";
import EventAttendance from "./components/EventAttendance";

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useFetchEventByID(Number(id));
  const fav = useFavouritesBackend();


  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(event?.location || "")}`;

  return (
    <>
      <PageHero
        title={event ? event.title : "Event Not Found"}
        subtitle="Event Details"
        backgroundImageUrl= "/HeroStock.jpg"
      />

      <main className="content">
        <article className="card">
          {loading && <p>Loading event...</p>}
           {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!loading && !error && !event && (
            <>
              <h2>Event not found</h2>
              <p>We couldn't find this event.</p>
              <Link to="/">← Back to home</Link>
            </>
          )}
          {!loading && !error && event && (
            <>
              {event.imageUrl && (
                <img className="banner" src={event.imageUrl} alt={event.title} />
              )}
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Status:</strong> {event.status}</p>
              <p>{event.description}</p>
              
              {/* Teams Attendees  */}
              <EventAttendance eventId={event.id} />

              {/* Buttons */}
              <section className="actions">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn">Get Directions</a>
                <Link to="/" className="btn">Back to Home</Link>
              </section>
              <div style={{ position: 'relative' }}>
                <FavouriteButton
                  liked={fav.isFavourite(event.id)}
                  disabled={fav.isBusy(event.id)}
                  onToggle={() => fav.toggleFavourite(event.id)}
                />
              </div>
            </>
          )}
        </article>
      </main>
    </>
  );
};

export default EventsPage;