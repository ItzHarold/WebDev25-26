// Tournament status types
export type TournamentStatus = "Registration Open" | "Ongoing" | "Completed" | "Cancelled";

// Main Tournament interface
export interface Tournament {
  id: string;
  name: string;
  game: string;
  status: TournamentStatus;
  currentTeams: number;
  maxTeams: number;
  startDate: string;
  registeredTeams: Team[];
}

// Team interface for teams registered in tournaments
export interface Team {
  id: string;
  teamName: string;
  players: number;
  registeredAt: string;
}
