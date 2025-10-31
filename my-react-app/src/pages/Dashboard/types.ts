export type TournamentStatus = "Registration Open" | "Ongoing" | "Completed" | "Cancelled";

export type Tournament = {
  id: string;
  name: string;
  game: string;
  status: TournamentStatus;
  currentTeams: number;
  maxTeams: number;
  startDate: string;
};

export type TeamEntryStatus = "Pending" | "Approved" | "Rejected" | "Resigned";

export type TeamEntry = {
  id: string;
  teamName: string;
  tournament: string;
  players: number;
  status: TeamEntryStatus;
};

export type Room = {
  id: string;
  name: string;
  type: "LAN" | "Online";
  capacity: number;
  active: boolean;
};
