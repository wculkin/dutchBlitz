import React from 'react';
import './Scores.css'

export interface PlayerScore {
    name: string;
    score: number;
    blitzCardsLeft: number;
}

export interface ScoresProps {
    playerScores: { [key: string]: PlayerScore } ;
}

const Scores: React.FC<ScoresProps> = ({ playerScores }) => {
    const getBlitzCardsClass = (count: number) => {
        if (count >= 7) return "green";
        if (count >= 3) return "orange";
        return "red";  // For 1 to 3 cards
    };
    return (
        <div className="scores-container">
            {Object.entries(playerScores).map(([key, playerScore]) => (
                <div key={key} className="player-score">
                    <span className="player-name">{playerScore.name}</span>
                    <span className="player-score">Score: {playerScore.score}</span>
                    <span className={`blitz-cards ${getBlitzCardsClass(playerScore.blitzCardsLeft)}`}>
                        Blitz cards left: {playerScore.blitzCardsLeft}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Scores;