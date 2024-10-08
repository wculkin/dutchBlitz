import React, { useEffect, useState } from "react";
import GameBoard from "../GameBoard/GameBoard";
import Scores, {PlayerScore} from "../Scores/Scores";
import {useLocation, useParams} from "react-router";
import { useGlobalState } from "../Firebase/GlobalUser";
import * as ROUTES from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import PlayerHand from "../PlayerHand/PlayerHand";
import { useFirebase } from "../Firebase/context";
import {getDatabase, ref, onValue} from 'firebase/database';
import {useObject} from "react-firebase-hooks/database";
import {CardProps, Colors, Deck, encodeKey, GameRound, GameState} from "../../sharedStuff/interfaces";
import AlertMessage from "../AlertMessage";


const GameTime: React.FC = () => {
    const navigate = useNavigate();
    const firebase = useFirebase();
    const db = getDatabase(firebase.app); // Use Realtime Database
    const { user } = useGlobalState();
    const { userData } = useGlobalState();
    const { keys } = useParams<{ keys: string }>();
    const dataRef = ref(db, `gameStates/${keys}`);
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    let [curTimer, setCurTimer] = useState<any>(null);

    const [snapshot, loading, error] = useObject(dataRef);
    if (!user) {
        alert("You need to sign in");
        navigate(ROUTES.SIGN_IN);
    }
    const [gameBoard, setGameBoard] = useState<CardProps[][] >([]);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [scores, setScores] = useState<{ [key: string]: PlayerScore } | null>(null);
    const playerName = userData!.displayName;
    const [blitzPile, setBlitzPile] = useState<CardProps[]>([]);
    const [postPile, setPostPile] = useState<CardProps[]>([]);
    const [woodPile, setWoodPile] = useState<CardProps[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
    const [path, setPath] = useState("")
    const [gameRound, setGameRound]  = useState(-1);
    const location = useLocation();
    if (!loading && gameRound === -1){
        console.log("roundInfo")
        const gameState:GameState = snapshot?.val()
        for(let i = gameState.gameRounds.length-1; i > -1;i--){
            if(gameState.gameRounds[i].hasStarted){
                setGameRound(i)
                break
            }
        }
    }

    const handleVisibleMessage = (message: string) => {
        clearTimeout(curTimer);
        setVisible(true);
        setMessage(message);
        const timer = setTimeout(() => {
            console.log("timer: ", timer)
            console.log("curTimer: ", curTimer)
            setVisible(false);
            }, 2000)
        setCurTimer(timer)
    }

    useEffect(() => {
        if (!keys) return;
        if(gameRound === -1) return;
        console.log("gameRound", gameRound);
        let curPath = `gameStates/${keys}/gameRounds/${gameRound}`
        if(location.pathname.includes("computer")){
            curPath = `computer/gameStates/${keys}/gameRounds/${gameRound}`
        }
        setPath(curPath)
        console.log("the path", curPath)

        const gameStateRef = ref(db, curPath);
        const unsubscribe = onValue(gameStateRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log("we heard new gameRound info ", snapshot.val())
                const curRound = snapshot.val() as GameRound;
                if(curRound.isRoundOver){
                    navigate(`/waitingRoom/${keys}`);
                }
                console.log("serialized ", curRound.board)
                console.log("da fuck")
                const serialized = curRound.board
                const gameBoardE: CardProps[][] = [];
                const length = Object.keys(serialized).length;

                for (let i = 0; i < length / 4; i++) {
                    gameBoardE.push([])
                }
                Object.keys(serialized).forEach((key: string) => {
                    const curPile = serialized[key]
                    const value: CardProps = curPile[curPile.length - 1];
                    const curNum = parseInt(key)
                    const i = Math.floor(curNum / 4)
                    const j = curNum % 4
                    gameBoardE[i][j] = value
                });
                const curBoard = gameBoardE
                setGameBoard(curBoard);
                const encodedPlayerName = encodeKey(playerName as string);
                setScores(curRound.scores);
                setIsOver(curRound.isRoundOver);
                const deck = curRound.decks[encodedPlayerName];
                if (isDeckDifferent(deck)) {
                    handleVisibleMessage("You just played a card!")
                    setPlayerHand(deck)
                }
            }
        });

        return () => unsubscribe();
    }, [keys, playerName, db, gameRound,path]);

    const isDeckDifferent = ( dbDeck: Deck) => {

        if(dbDeck.blitzPile && dbDeck.blitzPile.length !== blitzPile.length) return true;//seems like a dangerous use of local state might be okay practice though
        if(dbDeck.woodPile && dbDeck.woodPile.length !== woodPile.length) return true;
        if(dbDeck.postPile && dbDeck.postPile.length !== postPile.length) return true;

        if(!dbDeck.blitzPile && blitzPile.length) return true;//seems like a dangerous use of local state might be okay practice though
        if(!dbDeck.woodPile &&  woodPile.length) return true;
        if(!dbDeck.postPile && postPile.length) return true;
        return false
    }

    const handleCardClickOnGameBoard = async (card: CardProps) => {
        console.log("card clicked ", card)
        console.log("card from hand ", selectedCard)
        console.log("gameRound ", gameRound)

        if (selectedCard == null) {
            handleVisibleMessage("You need to select a card first")
            return;
        }
        if (card.color !== Colors.Blank && card.color !== selectedCard.color) {
            handleVisibleMessage("You tried to play the wrong color")
            return;
        }
        if (card.number + 1 !== selectedCard.number){
            handleVisibleMessage(card.owner! + " played the " + card.color + " " + card.number)
            return;
        }
        handleSelectCard(selectedCard,false)
        if (gameRound < 0 ) return;
        await firebase.doCallCloudFunction('MAKE_PLAYER_MOVE', {playerName,cardToAddToBoard:selectedCard,positionOnBoard:card.position,pathToCurrentRound:path,keys, round: gameRound} )

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
    };

    const handleSelectCard = (card: CardProps, isHighlighted: boolean) => {
        if(!card) return
        if(isHighlighted){
            if(selectedCard){
                selectedCard.highlighted = false
            }
            setSelectedCard(card);
            card.highlighted = true
        }else{
            card.highlighted = false
            setSelectedCard(null);
        }
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
            handleSelectCard(blitzPile[blitzPile.length-1],true)
        }else if(event.key ==='j'){
            if(postPile.length ===0) return
            handleSelectCard(postPile[0],true)
        }
        else if(event.key ==='k'){
            if(postPile.length < 2) return
            handleSelectCard(postPile[1],true)
        }
        else if(event.key ==='l'){
            if(postPile.length < 3) return
            handleSelectCard(postPile[2],true)
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
        }, [blitzPile,postPile,woodPile,selectedCard]);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    return (
        <div>
            {scores && (
                <>
                    <Scores playerScores={scores} />
                </>
            )}
            <>
                {visible && <AlertMessage message={message}/>}
            </>
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
                        totalLength={woodPile.length - 1}
                    />
                </>
            )}
        </div>
    );
};

export default GameTime;
