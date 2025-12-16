import React from "react";

interface Team {
    id: string;
    name: string;
    players: number;
    imageUrl?: string;
}

interface TeamCardobj {
    team: Team;
}

const TeamCard: React.FC<TeamCardobj> = ({ team }) => {
    return (
        <article className="team-card">
            <div
                className="team-image"
                style={{ backgroundImage: `url(${team.imageUrl})` }}
            ></div>
            <div className="team-info">
                <h3 className="team-name">{team.name}</h3>
                <p className="team-players">{team.players} players</p>
            </div>
        </article>
    );
};

export default TeamCard;