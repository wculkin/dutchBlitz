import React, { useMemo } from 'react';
import './Card.css';
import {CardProps, Colors} from "../../sharedStuff/cardEnums";



const Card: React.FC<CardProps> = ({ color, number, owner, onClick, highlighted }) => {
  const colorClass = useMemo(() => {
    switch (color) {
      case Colors.Red: return 'card-red';
      case Colors.Blue: return 'card-blue';
      case Colors.Green: return 'card-green';
      case Colors.Yellow: return 'card-yellow';
      default: return 'card-blank';
    }
  }, [color]);

  return (
    <div
      className={`card ${colorClass} ${highlighted ? 'card-highlighted' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {number !== undefined && <div className="card-number">{number}</div>}
    </div>
  );
};

export default Card;
