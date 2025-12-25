import React from "react";
import { Link } from "react-router-dom";
import mockEvents from "../../shared/mockdata/mockEvents.json";
import EventGrid from "../../homepage/components/Eventgrid.css";
import { useFavourites } from "../../pages/Events/components/FavouritesContext";
import { useAuth } from "../../features/auth/AuthProvider";

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
              <h2>Favourites</h2>
            </div>
          </div>

          {/* {(!user || favouriteEvents.length === 0) ? (
            <article className="card" style={{ marginTop: "1rem" }}>
              <h3>No Favourites yet</h3>
              <p>
                Tap the heart on an event to save it here.
              </p>
              <Link to="/Home">
                <button type="button">Cancel</button>
              </Link>
            </article>
          ) : (
            // <EventGrid events={favouriteEvents} />
          )} */}
        </section>
      </div>
    </>
  );
};

export default FavouritesPage;
