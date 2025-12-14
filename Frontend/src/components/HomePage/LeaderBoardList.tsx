import React from "react";

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
        <div className="leaderboard">
            <div className="leaderboard-list">
                {data.map(entry => (
                    <div key={entry.rank} className="leaderboard-item">
                        <span className="rank">#{entry.rank}</span>
                        <span className="team-name">{entry.teamName}</span>
                        <span className="points">{entry.points} Score</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;