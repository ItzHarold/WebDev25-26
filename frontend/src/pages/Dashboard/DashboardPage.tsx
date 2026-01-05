import { useState, useEffect } from "react";
import TournamentList from "./components/TournamentList";
import TournamentForm from "./components/TournamentForm";
import TournamentDetails from "./components/TournamentDetails";
import DashboardStats from "./components/DashboardStats";
import "../../shared/styles/global.css";
import "./DashboardPage.css";
import { fetchEvents, createEvent, updateEvent, deleteEvent, uploadEventImage } from "../../shared/api/eventApi";
import type { Event, EventRequest } from "../../shared/types/Event";
import { fetchTeams } from "../../shared/api/teamApi";
import type { Team } from "../../shared/types/Team";
import { fetchTeamsByEvent, removeTeamFromEventByIds } from "../../shared/api/eventTeamApi";

type Tournament = Event & {
  participatingTeams: number[];
};

const DashboardPage = () => {
  // get data from APIs
  const [events, setEvents] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // controls for showing/hiding different parts
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Tournament | null>(null);
  const [selectedEventTeams, setSelectedEventTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsData, teamsData] = await Promise.all([
        fetchEvents(),
        fetchTeams()
      ]);

      // Transform API response to match frontend types
      const transformedEvents: Tournament[] = await Promise.all(
        eventsData.map(async (event) => {
          const eventTeams = await fetchTeamsByEvent(event.id);
          return {
            id: event.id,
            title: event.title,
            location: event.location || "",
            date: new Date(event.date).toISOString().split('T')[0], // YYYY-MM-DD format
            description: event.description || "",
            detail: event.detail || "",
            status: event.status,
            imageUrl: event.imageUrl || "",
            participatingTeams: eventTeams.map(t => t.id)
          };
        })
      );

      setEvents(transformedEvents);
      setTeams(teamsData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // add new event to list
  const handleCreateEvent = async (eventData: Tournament, imageFile: File | null) => {
    try {
      const eventRequest: EventRequest = {
        title: eventData.title,
        location: eventData.location,
        date: eventData.date, // Already in YYYY-MM-DD format from form
        description: eventData.description,
        detail: eventData.detail,
        status: eventData.status,
        imageUrl: eventData.imageUrl
      };

      const createdEvent = await createEvent(eventRequest);

      // Upload image if provided
      if (imageFile && createdEvent.id) {
        await uploadEventImage(createdEvent.id, imageFile);
      }

      const newEvent: Tournament = {
        id: createdEvent.id,
        title: createdEvent.title,
        location: createdEvent.location || "",
        date: new Date(createdEvent.date).toISOString().split('T')[0],
        description: createdEvent.description || "",
        detail: createdEvent.detail || "",
        status: createdEvent.status,
        imageUrl: createdEvent.imageUrl || "",
        participatingTeams: []
      };

      setEvents([...events, newEvent]);
      setShowCreateForm(false);
    } catch (err: any) {
      alert("Failed to create event: " + err.message);
      console.error("Error creating event:", err);
    }
  };

  // update event in the list
  const handleEditEvent = async (eventData: Tournament, imageFile: File | null) => {
    try {
      const eventRequest: EventRequest = {
        title: eventData.title,
        location: eventData.location,
        date: eventData.date, // Already in YYYY-MM-DD format from form
        description: eventData.description,
        detail: eventData.detail,
        status: eventData.status,
        imageUrl: eventData.imageUrl
      };

      await updateEvent(eventData.id, eventRequest);
      if (imageFile && eventData.id) {
        await uploadEventImage(eventData.id, imageFile);
      }

      // Update local state
      const updatedList = events.map((event: Tournament) => {
        if (event.id === eventData.id) {
          return eventData;
        }
        return event;
      });
      setEvents(updatedList);
      setShowEditForm(false);
      setSelectedEvent(null);
    } catch (err: any) {
      alert("Failed to update event: " + err.message);
      console.error("Error updating event:", err);
    }
  };

  // remove event from list
  const handleDeleteEvent = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((event: Tournament) => event.id !== id));
      } catch (err: any) {
        alert("Failed to delete event: " + err.message);
        console.error("Error deleting event:", err);
      }
    }
  };

  // show event details
  const handleViewEvent = async (event: Tournament) => {
    try {
      const eventTeams = await fetchTeamsByEvent(event.id);
      setSelectedEventTeams(eventTeams);
      setSelectedEvent(event);
      setShowDetails(true);
    } catch (err: any) {
      alert("Failed to load event details: " + err.message);
      console.error("Error loading event details:", err);
    }
  };

  // open edit form
  const handleEditClick = (event: Tournament) => {
    setSelectedEvent(event);
    setShowEditForm(true);
  };

  // remove team from event
  const handleDisqualifyTeam = async (teamId: number) => {
    if (!selectedEvent) return;
    
    const confirmRemove = window.confirm("Remove this team?");
    if (!confirmRemove) return;
    
    try {
      await removeTeamFromEventByIds(selectedEvent.id, teamId);
      
      // Update local state
      const newTeamList = selectedEvent.participatingTeams.filter((id: number) => id !== teamId);
      const updatedEvent = { ...selectedEvent, participatingTeams: newTeamList };
      
      // Update events list
      const newEvents = events.map((event: Tournament) => {
        if (event.id === updatedEvent.id) return updatedEvent;
        return event;
      });
      setEvents(newEvents);
      setSelectedEvent(updatedEvent);
      
      // Update selected event teams
      setSelectedEventTeams(selectedEventTeams.filter((team: Team) => team.id !== teamId));
    } catch (err: any) {
      alert("Failed to remove team: " + err.message);
      console.error("Error removing team:", err);
    }
  };

  // close all modals
  const handleCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDetails(false);
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

          {loading && (
            <div className="loading-message">Loading dashboard data...</div>
          )}

          {error && (
            <div className="error-message">
              Error: {error}
              <button onClick={loadData} className="btn-retry">Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <DashboardStats events={events} teams={teams} />

              {!showCreateForm && !showEditForm && !showDetails && (
                <>
                  <div className="dashboard-controls">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button
                      className="btn-create"
                      onClick={() => setShowCreateForm(true)}
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

              {(showCreateForm || showEditForm) && (
                <TournamentForm
                  tournament={selectedEvent || undefined}
                  onSave={showCreateForm ? handleCreateEvent : handleEditEvent}
                  onCancel={handleCancel}
                />
              )}

              {showDetails && selectedEvent && (
                <TournamentDetails
                  tournament={selectedEvent}
                  teams={selectedEventTeams}
                  onClose={handleCancel}
                  onDisqualifyTeam={handleDisqualifyTeam}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
