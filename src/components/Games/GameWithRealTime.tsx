import React, { useEffect, useState } from "react";
import GameBoard from "../GameBoard/GameBoard";
import Scores, {PlayerScore} from "../Scores/Scores";
import {useLocation, useParams} from "react-router";
import { GameState} from "../../apis/gameServices";
import { Deck, GameInfo } from "../../sharedStuff/GameInfo";
import { CardProps, Colors } from "../../sharedStuff/cardEnums";
import { useGlobalState } from "../Firebase/GlobalUser";
import * as ROUTES from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import PlayerHand from "../PlayerHand/PlayerHand";
import { deserializeGameBoard, encodeKey } from "../../sharedStuff/helpers";
import { useFirebase } from "../Firebase/context";
import { getDatabase, ref, onValue, update } from 'firebase/database';
import {
    updateGameState,
    updateTransactGameState, updateTransactGameStateWithTwoTransactsAndUpdateScore,

} from "../../apis/gameServicesWithRealTimeDB";

export type GameBoardProps = {
    gameInfo: GameInfo;
    gameBoard: CardProps[][];
    gameKey: string;
};

type GameWithRealTimeProps = {
    route: string
}

const GameTime: React.FC = () => {
    const navigate = useNavigate();
    const firebase = useFirebase();
    const db = getDatabase(firebase.app); // Use Realtime Database
    const { user } = useGlobalState();

    if (!user) {
        alert("You need to sign in");
        navigate(ROUTES.SIGN_IN);
    }

    const [gameBoard, setGameBoard] = useState<CardProps[][]>([]);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [scores, setScores] = useState<{ [key: string]: PlayerScore } | null>(null);
    const [playerName, setPlayerName] = useState(user!.email);
    const [blitzPile, setBlitzPile] = useState<CardProps[]>([]);
    const [postPile, setPostPile] = useState<CardProps[]>([]);
    const [woodPile, setWoodPile] = useState<CardProps[]>([]);
    const [selectedCardId, setSelectedCardId] = useState(-1);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [path, setPath] = useState("")
    const { keys } = useParams<{ keys: string }>();
    const location = useLocation();
    useEffect(() => {
        if (!keys) return;
        let curPath = `gameStates/${keys}`
        if(location.pathname.includes("computer")){
            curPath = `computer/gameStates/${keys}`
        }
        setPath(curPath)

        const gameStateRef = ref(db, curPath);
        const unsubscribe = onValue(gameStateRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("we heard new gameState ", snapshot.val() )
                const gameState = snapshot.val() as GameState;
                const curBoard = deserializeGameBoard(gameState.board);

                if (gameBoard.length === 0) {
                    setGameBoard(curBoard);
                } else {
                    let boolFlag = false;
                    for (let i = 0; i < curBoard.length; i++) {
                        for (let j = 0; j < curBoard[i].length; j++) {
                            if (curBoard[i][j].number > gameBoard[i][j].number) {
                                curBoard[i][j] = gameBoard[i][j];
                                boolFlag = true;
                            }
                        }
                    }
                    if (boolFlag) {
                        setGameBoard(curBoard);
                    }
                }
                const encodedPlayerName = encodeKey(playerName as string);
                setScores(gameState.scores);
                setIsOver(false);
                const deck = gameState.decks[encodedPlayerName];
                if(isDeckDifferent(deck)){
                    setPlayerHand(deck)
                }
                // if (postPile.length === 0 && !isOver) {
                //     setPlayerHand(deck);
                // } else {
                //     if (deck.blitzPile.length < blitzPile.length) {
                //         setBlitzPile(deck.blitzPile);
                //         setPostPile(deck.postPile);
                //     }else if (deck.postPile.length < postPile.length){
                //         setPostPile(deck.postPile);
                //     }
                //
                //     if (deck.woodPile < woodPile) {
                //         setWoodPile(deck.woodPile);
                //     }
                // }
            }
        });

        return () => unsubscribe();
    }, [keys, playerName, db]);

    const isDeckDifferent = ( dbDeck: Deck) => {
        if(!dbDeck) return true;
        if(dbDeck.blitzPile && dbDeck.blitzPile.length !== blitzPile.length) return true;//seems like a dangerous use of local state might be okay practice though
        if(dbDeck.woodPile && dbDeck.woodPile.length !== woodPile.length) return true;
        if(dbDeck.postPile && dbDeck.postPile.length !== postPile.length) return true;

        if(!dbDeck.blitzPile && blitzPile.length) return true;//seems like a dangerous use of local state might be okay practice though
        if(!dbDeck.woodPile &&  woodPile.length) return true;
        if(!dbDeck.postPile && postPile.length) return true;
        return false
    }

    const handleCardClickOnGameBoard = async (card: CardProps) => {
        if (selectedCard == null || selectedCardId === -1) return;
        if (card.color !== Colors.Blank && card.color !== selectedCard.color) return;
        if (card.number + 1 !== selectedCard.number) return;

        // selectedCard.positionX = card.positionX;
        // selectedCard.positionY = card.positionY;
        //const deckWithRemovedCard: Deck = removeCardFromPlayerHand(selectedCard) as Deck;

        await updateTransactGameStateWithTwoTransactsAndUpdateScore(playerName as string, selectedCard, card,path);
        setSelectedCard(null);
        setSelectedCardId(-1);
    };

    const setPlayerHand = (deck: Deck) => {
        if(deck.blitzPile){
            setBlitzPile(deck.blitzPile);
        }else{
             setBlitzPile([]);
        }
        if(deck.postPile){
            setPostPile(deck.postPile);
        }else{
             setPostPile([]);
        }
        if(deck.woodPile){
            setWoodPile(deck.woodPile);
        }else{
             setWoodPile([]);
        }
        setSelectedCardId(-1);
    };

     const removeCardFromPlayerHand = (card: CardProps) => {
        if (postPile.includes(card) && blitzPile.length) {
            const moveOver = blitzPile.pop();
            postPile.push(moveOver as CardProps);
        }
        const curBlitzPile = blitzPile.filter(c => c !== card);
        const curPostPile = postPile.filter(c => c !== card);
        const curWoodPile = woodPile.filter(c => c !== card);
        if (curBlitzPile.length === 0) {
            setIsOver(true);
        }
        return {
            blitzPile: curBlitzPile,
            postPile: curPostPile,
            woodPile: curWoodPile,
            owner: playerName
        };
    };

    const handleSelectCard = (card: CardProps) => {
        setSelectedCard(card);
        setSelectedCardId(0);
    };


    const handleKeyDown = (event: KeyboardEvent) => {
        if (!gameBoard) return
        if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4') {
            if(event.key === '1'){
                 handleCardClickOnGameBoard(gameBoard[0][0])
            }else if(event.key === '2'){
                handleCardClickOnGameBoard(gameBoard[0][1])
            }else if(event.key === '3'){
                handleCardClickOnGameBoard(gameBoard[0][2])
            }else if(event.key === '4'){
                handleCardClickOnGameBoard(gameBoard[0][3])
            }

        }
        if(gameBoard.length > 1 && (
            event.key === 'q' || event.key === 'w' || event.key === 'e' || event.key === 'r'
        )){
            if(event.key === 'q'){
                 handleCardClickOnGameBoard(gameBoard[1][0])
            }else if(event.key === 'w'){
                handleCardClickOnGameBoard(gameBoard[1][1])
            }else if(event.key === 'e'){
                handleCardClickOnGameBoard(gameBoard[1][2])
            }else if(event.key === 'r'){
                handleCardClickOnGameBoard(gameBoard[1][3])
            }
        }
        if(gameBoard.length > 2 && (
            event.key === 'a' || event.key === 's' || event.key === 'd' || event.key === 'f'
        )){
            if(event.key === 'a'){
                 handleCardClickOnGameBoard(gameBoard[2][0])
            }else if(event.key === 's'){
                handleCardClickOnGameBoard(gameBoard[2][1])
            }else if(event.key === 'd'){
                handleCardClickOnGameBoard(gameBoard[2][2])
            }else if(event.key === 'f'){
                handleCardClickOnGameBoard(gameBoard[2][3])
            }
        }
        if(gameBoard.length > 3 && (
            event.key === 'z' || event.key === 'x' || event.key === 'c' || event.key === 'v'
        )){
            if(event.key === 'z'){
                 handleCardClickOnGameBoard(gameBoard[3][0])
            }else if(event.key === 'x'){
                handleCardClickOnGameBoard(gameBoard[3][1])
            }else if(event.key === 'c'){
                handleCardClickOnGameBoard(gameBoard[3][2])
            }else if(event.key === 'v'){
                handleCardClickOnGameBoard(gameBoard[3][3])
            }
        }

        if(event.key ==='h'){
            if(blitzPile.length ===0) return
            handleSelectCard(blitzPile[blitzPile.length-1])
        }else if(event.key ==='j'){
            if(postPile.length ===0) return
            handleSelectCard(postPile[0])
        }
        else if(event.key ==='k'){
            if(postPile.length < 2) return
            handleSelectCard(postPile[1])
        }
        else if(event.key ==='l'){
            if(postPile.length < 3) return
            handleSelectCard(postPile[2])
        }
        else if(event.key ===';'){
            //this is tech debt for now. I don't have a super easy way to get the current woodsIndex will fix eventually
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        }, [blitzPile,postPile,woodPile,selectedCard,selectedCardId]);




    return (
        <div>
            {scores && (
                <>
                    <Scores playerScores={scores} />
                </>
            )}
            <GameBoard rows={gameBoard} onCardClicked={handleCardClickOnGameBoard} />
            {isOver ? (
                <div className="game-over-message">Game is over</div>
            ) : (
                <>
                    <PlayerHand
                        blitzPile={blitzPile}
                        postPiles={postPile}
                        woodPile={woodPile}
                        onSelectCard={handleSelectCard}
                        selectedCardId={selectedCardId}
                        totalLength={woodPile.length - 1}
                    />
                </>
            )}
        </div>
    );
};

export default GameTime;
