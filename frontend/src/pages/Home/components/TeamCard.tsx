import React from "react";
import "./TeamList.css";
import type { Team } from "../../../shared/types/Team";

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
                <h3 className="team-name">{team.description}</h3>
            </div>
        </article>
    );
};

export default TeamCard;