// src/components/ScoreBoard.tsx
import React from 'react';

interface Score {
  player: string;
  points: number;
}

interface ScoreBoardProps {
  scores: Score[];
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  return (
    <div className="score-board">
      <h3>Score Board</h3>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>{score.player}: {score.points}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreBoard;