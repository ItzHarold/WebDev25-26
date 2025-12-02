import React from "react";

interface Tournament {
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
}

interface TournamentListProps {
  tournaments: Tournament[];
  onView: (event: Tournament) => void;
  onEdit: (event: Tournament) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  onView,
  onEdit,
  onDelete,
  searchTerm,
}) => {
  const filteredEvents = tournaments.filter((event) => {
    const search = searchTerm.toLowerCase();
    return event.title.toLowerCase().includes(search) || 
           event.location.toLowerCase().includes(search);
  });

  const getStatusClass = (status: string) => {
    if (status === "upcoming") return "status-upcoming";
    if (status === "live") return "status-ongoing";
    if (status === "ended") return "status-completed";
    return "";
  };

  return (
    <div className="tournament-list">
      <div className="tournament-grid">
        {filteredEvents.length === 0 ? (
          <p className="no-results">No events found</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="tournament-card">
              <div className="tournament-header">
                <h3>{event.title}</h3>
                <span className={`status-badge ${getStatusClass(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <div className="tournament-info">
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Teams:</strong> {event.participatingTeams?.length || 0}/{event.maxTeams}</p>
                <p className="desc">{event.description}</p>
              </div>
              <div className="tournament-actions">
                <button className="btn-view" onClick={() => onView(event)}>
                  View
                </button>
                <button className="btn-edit" onClick={() => onEdit(event)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(event.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TournamentList;
