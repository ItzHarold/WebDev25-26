import React from "react";
import "./LeaderBoard.css";

interface LeaderboardEntry {
    rank: number;
    teamName: string;
    points: number;
}

interface LeaderboardProps {
    data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
    return (
        <section className="leaderboard">
            <ol className="leaderboard-list">
                {data.map(entry => (
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