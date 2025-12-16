import { useState } from "react";
import TournamentList from "./components/TournamentList";
import TournamentForm from "./components/TournamentForm";
import TournamentDetails from "./components/TournamentDetails";
import DashboardStats from "./components/DashboardStats";
import mockData from "../../shared/mockdata/mockAdmin.json";
import "./LightDashboard.css";
import "./DarkDashboard.css";

type Tournament = {
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

type Team = {
  id: string;
  name: string;
  game: string;
  players: number;
  imageUrl: string;
};

const DashboardPage = () => {
  // get data from json
  const [events, setEvents] = useState<Tournament[]>(mockData.tournaments);
  const [teams] = useState<Team[]>(mockData.teams);
  
  // controls for showing/hiding different parts
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Tournament | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // add new event to list
  const handleCreateEvent = (eventData: Tournament) => {
    // make a simple ID using timestamp
    const newId = "T" + Date.now().toString().slice(-3);
    const newEvent = { ...eventData, id: newId };
    
    setEvents([...events, newEvent]);
    setShowCreateForm(false);
  };

  // update event in the list
  const handleEditEvent = (eventData: Tournament) => {
    // find and replace the event
    const updatedList = events.map(event => {
      if (event.id === eventData.id) {
        return eventData;
      }
      return event;
    });
    setEvents(updatedList);
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  // remove event from list
  const handleDeleteEvent = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  // show event details
  const handleViewEvent = (event: Tournament) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  // open edit form
  const handleEditClick = (event: Tournament) => {
    setSelectedEvent(event);
    setShowEditForm(true);
  };

  // remove team from event
  const handleDisqualifyTeam = (teamId: string) => {
    if (!selectedEvent) return;
    
    const confirmRemove = window.confirm("Remove this team?");
    if (!confirmRemove) return;
    
    // filter out the team
    const newTeamList = selectedEvent.participatingTeams.filter(id => id !== teamId);
    const updatedEvent = { ...selectedEvent, participatingTeams: newTeamList };
    
    // update events list
    const newEvents = events.map(event => {
      if (event.id === updatedEvent.id) return updatedEvent;
      return event;
    });
    setEvents(newEvents);
    setSelectedEvent(updatedEvent);
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

          <DashboardStats events={events} teams={teams} />

          {!showCreateForm && !showEditForm && !showDetails && (
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
