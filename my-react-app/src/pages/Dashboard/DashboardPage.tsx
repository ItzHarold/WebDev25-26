import React, { useState } from "react";
import TournamentList from "../../components/Dashboard/TournamentList";
import TournamentForm from "../../components/Dashboard/TournamentForm";
import TournamentDetails from "../../components/Dashboard/TournamentDetails";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import mockData from "../../data/mockAdmin.json";
import "./LightDashboard.css";
import "./DarkDashboard.css";

type Event = {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  detail: string;
  status: string;
  imageUrl: string;
  maxTeams: number;
  participatingTeams: string[];
};

type DashboardStats = {
  totalEvents: number;
  activeEvents: number;
  totalTeams: number;
};

type ViewMode = "list" | "create" | "edit" | "details";

const DashboardPage: React.FC = () => {
  const [events, setEvents] = useState(mockData.tournaments);
  const [teams] = useState(mockData.teams);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const stats: DashboardStats = {
    totalEvents: events.length,
    activeEvents: events.filter(
      (e) => e.status === "upcoming" || e.status === "ongoing" || e.status === "live"
    ).length,
    totalTeams: teams.length,
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: `T${String(events.length + 1).padStart(3, "0")}`,
    };
    setEvents([...events, newEvent]);
    setViewMode("list");
  };

  const handleEditEvent = (eventData: Event) => {
    setEvents(
      events.map((e) => (e.id === eventData.id ? eventData : e))
    );
    setViewMode("list");
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setViewMode("details");
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setViewMode("edit");
  };

  const handleDisqualifyTeam = (teamId: string) => {
    if (selectedEvent && window.confirm("Remove this team from the event?")) {
      const updatedEvent = {
        ...selectedEvent,
        participatingTeams: selectedEvent.participatingTeams.filter(
          (id: string) => id !== teamId
        ),
      };
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id ? updatedEvent : e
        )
      );
      setSelectedEvent(updatedEvent);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Manage events, teams, and view statistics</p>
          </div>

          <DashboardStats stats={stats} />

          {viewMode === "list" && (
            <>
              <div className="dashboard-controls">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <button
                  className="btn-create"
                  onClick={() => setViewMode("create")}
                >
                  + Create Event
                </button>
              </div>

              <TournamentList
                tournaments={events}
                onView={handleViewEvent}
                onEdit={handleEditClick}
                onDelete={handleDeleteEvent}
                searchTerm={searchTerm}
              />
            </>
          )}

          {(viewMode === "create" || viewMode === "edit") && (
            <TournamentForm
              tournament={selectedEvent || undefined}
              onSave={
                viewMode === "create"
                  ? handleCreateEvent
                  : handleEditEvent
              }
              onCancel={handleCancel}
            />
          )}

          {viewMode === "details" && selectedEvent && (
            <TournamentDetails
              tournament={selectedEvent}
              teams={teams}
              onClose={handleCancel}
              onDisqualifyTeam={handleDisqualifyTeam}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
