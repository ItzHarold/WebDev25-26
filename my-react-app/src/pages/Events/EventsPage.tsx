import React, { useMemo, useState } from "react";
import defaulticon from "../../assets/game.jpg";
import EventGrid from "../../components/HomePage/EventGrid";

type Status = "Live" | "upcoming" | "Ended";

type EventCard = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  status: Status;
  imageUrl: string;
};

const mockEvents: EventCard[] = [
  { id: "ev-1", title: "Valorant Summer Cup",   location: "Rotterdam", date: "June 20–22, 2025", description: "Bo3 qualifiers with finals on Sunday.", status: "Live",     imageUrl: defaulticon },
  { id: "ev-2", title: "League Scrim Night",    location: "Amsterdam", date: "July 5, 2025",     description: "Community scrims for all ranks.",        status: "upcoming", imageUrl: defaulticon },
  { id: "ev-3", title: "CS2 Retro LAN",         location: "Utrecht",   date: "May 14, 2024",     description: "Oldschool LAN vibes & mini-tournaments.", status: "Ended",    imageUrl: defaulticon },
  { id: "ev-4", title: "Rocket League Duo Cup", location: "Eindhoven", date: "August 10–11, 2025", description: "2v2 single-elimination bracket.",      status: "upcoming", imageUrl: defaulticon },
  { id: "ev-5", title: "Overwatch Clash",       location: "Delft",     date: "June 28, 2025",    description: "Quick-play tournament with prizes.",     status: "Live",     imageUrl: defaulticon }
];

function parseStartDate(dateStr: string): Date {
  const monthMap: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  const m = dateStr.match(/([A-Za-z]+)\s+(\d{1,2})(?:[–-]\d{1,2})?,?\s*(\d{4})/);
  if (m) {
    const monthName = m[1].toLowerCase();
    const day = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);
    const monthIdx = monthMap[monthName];
    if (Number.isInteger(monthIdx) && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, monthIdx, day);
    }
  }
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

type Tab = "all" | "live" | "upcoming" | "ended";
type SortKey = "newest" | "oldest";

const EventsPage: React.FC = () => {
  const [events] = useState<EventCard[]>(mockEvents);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("newest");

  // 1) filter op tab
  const filteredByTab = useMemo(() => {
    if (tab === "all") return events;
    if (tab === "live") return events.filter(e => e.status === "Live");
    if (tab === "upcoming") return events.filter(e => e.status === "upcoming");
    return events.filter(e => e.status === "Ended");
  }, [events, tab]);

  // 2) filter op zoekterm (titel, locatie, beschrijving)
  const filteredByQuery = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredByTab;
    return filteredByTab.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }, [filteredByTab, query]);

  // 3) sorteren op startdatum (parsed)
  const visibleEvents = useMemo(() => {
    const arr = [...filteredByQuery];
    arr.sort((a, b) => {
      const da = parseStartDate(a.date).getTime();
      const db = parseStartDate(b.date).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return arr;
  }, [filteredByQuery, sort]);
  
  type GridEvent = React.ComponentProps<typeof EventGrid>["events"][number];

  const gridEvents: GridEvent[] = visibleEvents.map(e => ({
    id: e.id,
    title: e.title,
    location: e.location,
    date: e.date,
    description: e.description,
    status: e.status.toLowerCase() as GridEvent["status"],
    imageUrl: e.imageUrl,
  }));

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
            <button
              className={`filter-btn ${tab === "all" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "all"}
              onClick={() => setTab("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${tab === "live" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "live"}
              onClick={() => setTab("live")}
            >
              Live
            </button>
            <button
              className={`filter-btn ${tab === "upcoming" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "upcoming"}
              onClick={() => setTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${tab === "ended" ? "active" : ""}`}
              role="tab"
              aria-selected={tab === "ended"}
              onClick={() => setTab("ended")}
            >
              Ended
            </button>
          </div>
        </div>

        <div className="events-controls">
          <input
            type="text"
            placeholder="Search by title or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search events"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort events by date"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>        
        <EventGrid events={gridEvents} />
      </section>
    </>
  );
};

export default EventsPage;
