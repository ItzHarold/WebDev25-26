import React from "react";
import TeamCard from "./TeamCard";

interface Team {
    id: string;
    name: string;
    players: number;
    imageUrl?: string;
}

interface TeamListobj {
    teams: Team[];
}

const TeamList: React.FC<TeamListobj> = ({ teams }) => {
    if (teams.length === 0) {
        return <p>Why not create a team?.</p>;
    }

    return (
        <div className="teams-list">
            {teams.map(team => (
                <TeamCard key={team.id} team={team} />
            ))}
        </div>
    );
};

export default TeamList;