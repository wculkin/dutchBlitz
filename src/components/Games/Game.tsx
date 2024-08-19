// import scores, {PlayerScore} from "../Scores/Scores";
// import React, {useEffect, useState} from "react";
// import GameBoard from "../GameBoard/GameBoard";
// import Scores from "../Scores/Scores";
// import {useParams} from "react-router";
// import {GameState, getGameState, updateGameState} from "../../apis/gameServices";
// import {Deck, GameInfo} from "../../sharedStuff/GameInfo";
// import { CardProps, Colors} from "../../sharedStuff/cardEnums";
// import {useGlobalState} from "../Firebase/GlobalUser";
// import * as ROUTES from "../../constants/routes";
// import {useNavigate} from "react-router-dom";
// import PlayerHand from "../PlayerHand/PlayerHand";
// import {createDeck, decodeKey, deserializeGameBoard, encodeKey, getPlayerScores} from "../../sharedStuff/helpers";
// import { doc, onSnapshot, query, where} from "firebase/firestore";
// import {useFirebase} from "../Firebase/context";
//
//
//
import {GameInfo} from "../../sharedStuff/GameInfo";
import {CardProps} from "../../sharedStuff/cardEnums";

export type  GameBoardProps = {
    gameInfo: GameInfo
    gameBoard: CardProps[][]
    gameKey: string
}
const Game: React.FC = ({}) => {
    return <div></div>

}
//     const navigate = useNavigate();
//      const firebase = useFirebase();
//      const db = firebase.db
//     const {user } = useGlobalState()
//      if (!user){
//          alert("You need to sign in")
//          navigate(ROUTES.SIGN_IN);
//      }
//     const [gameBoard, setGameBoard] = useState<CardProps[][] >([])
//     const [isOver, setIsOver] = useState<boolean >(false)
//
//     const [scores, setScores] = useState<{ [key: string]: PlayerScore } | null>(null);
//     const [playerName, setPlayerName] = useState(user!.email)
//     const [blitzPile, setBlitzPile] = useState<CardProps[]>([]);
//     const [postPile, setPostPile] = useState<CardProps[]>([]);
//     const [woodPile, setWoodPile] = useState<CardProps[] >([]);
//     const [selectedCardId, setSelectedCardId] = useState(-1);
//     const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
//
// const { keys } = useParams<{ keys: string }>();
//      useEffect(() => {
//     if (!keys) return;
//     const docRef = doc(db, 'gameStates', keys);
//       const unsubscribe = onSnapshot(docRef, (doc) => {
//         if (doc.exists()) {
//         const gameState  = doc.data();
//         const curBoard = deserializeGameBoard(gameState.board);
//         if (gameBoard.length === 0){
//              setGameBoard(curBoard);
//         }else{
//             let boolFlag = false
//             for (let i = 0; i< curBoard.length;i++){
//                 for (let j = 0; j < curBoard[i].length;j++){
//                     if(curBoard[i][j].number < gameBoard[i][j].number){
//                         curBoard[i][j] = gameBoard[i][j]
//                         boolFlag = true
//                     }
//                 }
//             }
//             if(boolFlag){
//                 setGameBoard(curBoard);
//             }
//
//         }
//
//         const encodedPlayerName = encodeKey(playerName as string)
//          // console.log("The decks, ", gameState.decks[encodedPlayerName])
//
//         setScores(gameState.scores);
//         setIsOver(gameState.isOver);
//         const deck = gameState.decks[encodedPlayerName];
//         if (postPile.length === 0 && !isOver){
//             setPlayerHand(deck);
//         }else{
//
//                 setBlitzPile(deck.blitzPile)
//                 setPostPile(deck.postPile)
//
//
//                 setWoodPile(deck.woodPile)
//
//         }
//       }
//     });
//   //   const ownerEmail = 'wculkin24@gmail_dot_com';
//   //   const deckDocRef = doc(db, 'gameStates', keys, "decks", ownerEmail);
//   //
//   // const unsubscribe = onSnapshot(deckDocRef, (docSnap) => {
//   //   if (docSnap.exists()) {
//   //     const data = docSnap.data() ;
//   //     console.log(`Data for ,`, data);
//   //     // Handle the data as needed
//   //   } else {
//   //     console.log(`No such document for user:`);
//   //   }
//   // }, (error) => {
//   //   console.error("Error fetching document:", error);
//   // });
//   // const decksCollectionRef = collection(db, 'gameStates', keys, "decks");
//   // const q = query(decksCollectionRef, where("owner", "==", ownerEmail));
//   //   // const pathIWannaTest = keys+'.decks.wculkin24@gmail_dot_com'
//   //   // const docRef = doc(db, 'gameStates', keys, "decks");
//   //        console.log("beforeQUEREY")
//   //   const unsubscribe = onSnapshot(q, (snapshot) => {
//   //   console.log("Empey")
//   //       snapshot.forEach((doc) => {
//   //     console.log("IS IT HAPPENING")
//   //       if (doc.exists()) {
//   //
//   //       const data = doc.data();
//   //       console.log(`Data for ${doc.id}:`, data);
//   //       // Handle the data as needed
//   //     } else {
//   //       console.log(`No such document in subcollection: ${doc}`);
//   //     }
//   //   });
//   // }, (error) => {
//   //   console.error("Error fetching documents:", error);
//   // });
//
//
//     return () => unsubscribe();
//   }, [keys, playerName, db]);
//
//     const handleCardClickOnGameBoard = async(card:CardProps) => {
//         console.log("the board, ", gameBoard)
//         if (selectedCard == null) return
//         if (card.color !== Colors.Blank && card.color !== selectedCard.color) return
//         if (card.number+1 !== selectedCard.number) return
//         //gameBoard[card.positionX!][card.positionY!] = selectedCard
//         console.log("The positions ", card.positionX, card.positionY)
//         selectedCard.positionX = card.positionX
//         selectedCard.positionY = card.positionY
//         const deckWithRemovedCard:Deck = removeCardFromPlayerHand(selectedCard!)
//         //const newGameBoard = JSON.parse(JSON.stringify(gameBoard));
//         console.log("deckWithRemovedCard, ", deckWithRemovedCard)
//         console.log("selectedCard, ", selectedCard)
//         await updateGameState(keys as string,deckWithRemovedCard,isOver,playerName as string,selectedCard)
//         // setGameBoard(newGameBoard)
//         setSelectedCard(null);
//         setSelectedCardId(-1)
//
//
//     };
//      const setPlayerHand = (deck:Deck) =>{
//          setBlitzPile(deck.blitzPile);
//          setPostPile(deck.postPile);
//          setWoodPile(deck.woodPile);
//          setSelectedCardId( -1)
//     }
//
//      const removeCardFromPlayerHand = (card:CardProps) => {
//         if (postPile!.includes(card) && blitzPile!.length) {
//             const moveOver =blitzPile!.pop();
//             postPile!.push(moveOver as CardProps);
//         }
//         const curBlitzPile =blitzPile!.filter(c => c !== card);
//         const curPostPile = postPile!.filter(c => c !== card);
//         const curWoodPile = woodPile!.filter(c => c !== card);
//         if(curBlitzPile.length === 0){
//             setIsOver(true)
//         }
//          return {
//                 blitzPile: curBlitzPile,
//                 postPile: curPostPile,
//                 woodPile: curWoodPile,
//                 owner:playerName!
//         }
//     };
//
//      // const getIsOver = (deck:Deck) => {
//      //     if (deck.blitzPile.length){
//      //         return true
//      //     }
//      //     return false
//      // }
//     const handleSelectCard = (card: CardProps) => {
//         setSelectedCard(card);
//         setSelectedCardId( 0)
//     };
//     return (
//         <div>
//             {(scores) && (
//                 <>
//                     <Scores playerScores={scores} />
//                 </>
//             )}
//             <GameBoard rows={gameBoard}
//                        onCardClicked={handleCardClickOnGameBoard}
//             />
//             {isOver ? (
//             <div className="game-over-message">Game is over</div>
//       ) : (
//         <>
//            <PlayerHand
//                 blitzPile={blitzPile}
//                 postPiles={postPile}
//                 woodPile={woodPile}
//                 onSelectCard={handleSelectCard}
//                 selectedCardId={selectedCardId}
//                 totalLength={woodPile.length-1}
//             />
//         </>
//       )}
//         </div>
//     );
// };
export default Game;