import React from "react";
import { Link } from "react-router-dom";
import mockEvents from "../../data/mockEvents.json";
import EventGrid from "../../components/HomePage/EventGrid";
import { useFavourites } from "../../context/FavouritesContext";
import { useAuth } from "../../context/AuthContext";

const FavouritesPage: React.FC = () => {
  const { isLiked } = useFavourites();
  const { user } = useAuth();
  const favouriteEvents = (mockEvents as any[]).filter(e => isLiked(String(e.id)));

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>My Favourites</h1>
        </div>
      </section>

      <div className="main-content">
        <aside className="teams-sidebar" aria-hidden="true" />

        <section className="event-section">
          <div className="events-header">
            <div className="events-title">
              <h2>Favorites</h2>
            </div>
          </div>

          {(!user || favouriteEvents.length === 0) ? (
            <article className="card" style={{ marginTop: "1rem" }}>
              <h3>No favorites yet</h3>
              <p>
                Tap the heart on an event to save it here.
              </p>
              <Link to="/Home">
                <button type="button">Cancel</button>
              </Link>
            </article>
          ) : (
            <EventGrid events={favouriteEvents} />
          )}
        </section>
      </div>
    </>
  );
};

export default FavouritesPage;
