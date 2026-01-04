import React from "react";
import "./LeaderBoard.css";
import type { Team } from "../../../shared/types/Team";

interface LeaderboardProps {
    teams: Team[];
}
                    
const Leaderboard: React.FC<LeaderboardProps> = ({ teams }) => {
    const leaderboard = [...teams]
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 5)
                    .map((team, index) => ({
                        rank: index + 1,
                        teamName: team.description,
                        points: team.points,
                    }));
                    if (leaderboard.length === 0) {
        return <p>No leaderboard data available.</p>;
    }
    return (
        <section className="leaderboard">
            <ol className="leaderboard-list">
                {leaderboard.map(entry => (
                    <li key={entry.rank} className="leaderboard-item">
                        <strong className="rank">#{entry.rank}</strong>
                        <span className="team-name">{entry.teamName}</span>
                        <span className="points">{entry.points} Score</span>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default Leaderboard;