import React, { useMemo } from "react";
import { useAuth } from "../../features/auth/AuthProvider";
import { useFetchEvents } from "../../shared/hooks/useFetchEvents";
import { useFetchUserFavourites } from "../../shared/hooks/useFetchUserFavourites";
import EventGrid from "../Home/components/EventGrid";
import { getFavouriteEvents } from "./components/getFavouriteEvents";
import PageHero from "../../shared/ui/PageHero";

const FavouritesPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.userId ?? null;

  const { events, loading: eventsLoading, error: eventsError } = useFetchEvents();
  const {
    favourites,
    loading: favLoading,
    error: favError,
    reload
  } = useFetchUserFavourites(userId);

  const loading = eventsLoading || favLoading;
  const error = eventsError || favError;

  const favouriteEvents = useMemo(() => {
    return getFavouriteEvents(events, favourites);
  }, [events, favourites]);

  if (!userId) return <p>You must be logged in.</p>;
  if (loading) return <p>Loading favourites...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>

      <PageHero
        title="Favourites"
        subtitle="Overview of your favourite events"
        backgroundImageUrl="HeroStock.jpg"
      />
      <div className="main-content">
        <section className="event-section">
          <h1>My favourites</h1>

          {favouriteEvents.length === 0 ? (
            <p>No favourites yet.</p>
          ) : (
            <EventGrid events={favouriteEvents} onFavouriteChanged={reload}/>
          )}
        </section>
      </div>
    </>
  );
};

export default FavouritesPage;
