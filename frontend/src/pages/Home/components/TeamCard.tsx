import React from "react";
import "./TeamList.css";
import type { Team } from "../../../shared/types/Team";
import ImageBackground from "../../../shared/ui/ImageBackground";

interface TeamCardobj {
    team: Team;
}

const TeamCard: React.FC<TeamCardobj> = ({ team }) => {
    return (
        <article className="team-card">
            <ImageBackground
  imageUrl={team.imageUrl}
  defaultImage="/default-team.png"
  className="team-image"
/>
            <div className="team-info">
                <h3 className="team-name">{team.description}</h3>
            </div>
        </article>
    );
};

export default TeamCard;