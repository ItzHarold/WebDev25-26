import React from "react";
import TeamCard from "./TeamCard";
import "./TeamList.css";
import type { Team } from "../../../shared/types/Team";

interface TeamListobj {
    teams: Team[];
}

const TeamList: React.FC<TeamListobj> = ({ teams }) => {
    if (teams.length === 0) {
        return <p>Why not create a team?.</p>;
    }

    return (
        <div className="teams-list" aria-label="Teams list">
            {teams.map(team => (
                <TeamCard key={team.id} team={team} />
            ))}
        </div>
    );
};

export default TeamList;