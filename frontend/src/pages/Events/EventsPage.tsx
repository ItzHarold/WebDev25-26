import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHero from "../../shared/ui/PageHero";
import { fetchEventById } from "../../shared/api/eventApi";
import "./EventsPage.css";
import FavouriteButton from "../Favourites/components/FavouriteButton";
import { useFavouritesBackend } from "../Favourites/components/useFavouritesBackend";

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fav = useFavouritesBackend();
   useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await fetchEventById(Number(id));
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!event) {
    return (
      <main className="content">
        <article className="card">
          <h2>Event not found</h2>
          <p>We couldn't find this event.</p>
          <Link to="/">← Back to home</Link>
        </article>
      </main>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(event.location || "")}`;

//mock Attendees
  const attendees = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
  { id: "4", name: "Bob Brown" },
  { id: "5", name: "Charlie White" },
];

  return (
    <>
      <PageHero
        title={event.title}
        subtitle="Event Details"
        backgroundImageUrl="HeroStock.jpg"
      />

      <main className="content">
        <article className="card">
          {event.imageUrl && (
            <img className="banner" src={event.imageUrl} alt={event.title} />
          )}
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Status:</strong> {event.status}</p>
          <p>{event.description}</p>
          
          {/* Attendees Section */}
          <section>
            <h3>Attendees</h3>
            <p>{attendees.length - 1} others are going:</p>
            <div className="avatars">
              {attendees.slice(0, 5).map(attendee => (
                <div key={attendee.id} className="avatar" title={attendee.name}>
                  {attendee.name[0].toUpperCase()}
                </div>
              ))}
              {attendees.length > 5 && (
                <div className="more-avatars">+{attendees.length - 5}</div>
              )}
            </div>
          </section>

          {/* Buttons */}
          <section className="actions">
            <button className="btn">Attend</button>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn">Get Directions</a>
            <Link to="/" className="btn">Back to Home</Link>
            <FavouriteButton
              liked={fav.isFavourite(event.id)}
              disabled={fav.isBusy(event.id)}
              onToggle={() => fav.toggleFavourite(event.id)}
            />
          </section>
          
        </article>
      </main>
    </>
  );
};

export default EventsPage;
