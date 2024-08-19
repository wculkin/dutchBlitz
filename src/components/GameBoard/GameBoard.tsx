import React from 'react';
import './GameBoard.css';
import Card from "../Card/Card";
import {CardProps} from "../../sharedStuff/cardEnums";
type GameBoardProps = {
  rows: CardProps[][];
  onCardClicked: (card: CardProps) => void;
};
const GameBoard: React.FC<GameBoardProps> = ({ rows, onCardClicked}) => {
    return (
      <div className="gameboard" >
          {rows.map((row, rowIndex) => {
              return (
              <div key={rowIndex} className="gameboard-row" >
                {row.map((cardProps, cardIndex) => {
                  return <Card key={cardIndex} {...cardProps} onClick={() => onCardClicked(cardProps)}/>;
                })}
              </div>
            );
          })}
      </div>
  );
};

export default GameBoard;