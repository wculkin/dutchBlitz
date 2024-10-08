import React, { useState, useEffect } from 'react';
import './PlayerHand.css';
import Card from "../Card/Card";

type CardProps = React.ComponentProps<typeof Card>;

type PlayerHandProps = {
  blitzPile:CardProps[];
  postPiles:CardProps[];
  woodPile:CardProps[];
  onSelectCard: (card: CardProps, isHighlighted: boolean) => void;
  totalLength: number
};



const PlayerHand: React.FC<PlayerHandProps> = ({blitzPile ,postPiles,woodPile,onSelectCard, totalLength }) => {
  const [woodPileIndex, setWoodPileIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState<{pile: string, index: number} >({pile:"none", index:-1});

  const handleBlitzPileClick = () => {
      if(blitzPile.length === 0) return
    const card = blitzPile[blitzPile.length - 1];
    setHighlightedIndex({pile: 'blitz', index: 0});
    onSelectCard(card, true);
  };

  const handlePostPilesClick = (index: number) => {
      if(postPiles.length < index) return
    const card = postPiles[index];
    setHighlightedIndex({pile: 'post', index});
    onSelectCard(card,true);
  };

  const handleWoodPileClick = () => {
      if(woodPile.length < woodPileIndex) return
    const card = woodPile[woodPileIndex];
    setHighlightedIndex({pile: 'wood', index: woodPileIndex});
    onSelectCard(card,true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
         onSelectCard(woodPile[woodPileIndex], false);
            setWoodPileIndex((prevIndex) => {
                let nextIndex = prevIndex + 1;
                if (nextIndex > totalLength){
                  nextIndex = 0
                }
                return nextIndex;
            });
            setHighlightedIndex({pile:"none", index:-1});

    }
  };


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [woodPile, highlightedIndex, ]);

  return (
    <div className="player-hand">
      <div className="category blitz-pile">
        <div className="category-label">Blitz Pile: {blitzPile.length}</div>
        <div className="category-content">
          {blitzPile.length > 0 && (
              <Card
                  {...blitzPile[blitzPile.length - 1]} // Only display the top card
                  onClick={handleBlitzPileClick}
              />
          )}
        </div>
      </div>
      <div className="category post-pile">
        <div className="category-label">Post Piles: {postPiles.length}</div>
        <div className="category-content category-content-horizontal">
          {postPiles.map((card, index) => (
              <Card
                  key={index}
                  {...card}
                  onClick={() => handlePostPilesClick(index)}
              />
          ))}
        </div>
      </div>
      <div className="category woods-pile">
        <div className="category-label">Wood Pile: {totalLength+1}</div>
        <div className="category-content ">
          {woodPile.length > 0 && (
              <Card
                  {...woodPile[woodPileIndex]} // Display the card at the current index
                  onClick={handleWoodPileClick}
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;
