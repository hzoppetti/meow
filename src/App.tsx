import { useState, useEffect } from "react";

import "./App.css";
import cardBack from "../src/assets/react.svg";
import Confetti from "react-confetti";

type resultProps = {
  id: string;
  url: string;
  width: number;
  height: number;
};

type Cat = {
  id: string; // a cat id is a string
  url: string;
};

type Card = {
  url: string;
  id: number; // a card id is an index number from 0-19
};

// stolen from the internet
// takes an array shuffles about the contents
const shuffle = (array: Cat[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function App() {
  /**
   * I thought about making the cards cats and holding data like
   * isMatched and isFlipped in cat-cards but then you would be able to cheat
   * by inspecting the page and that's no fun
   */
  const [catData, setCatData] = useState<Cat[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);
  const [win, setWin] = useState(false);

  const api = async () => {
    const data = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=10`,
      {
        method: "GET",
      }
    );
    const jsonData: resultProps[] = await data.json();
    // double the data and randomly sort it before adding it to the dataset
    const doubledData: Cat[] = [];

    for (let i = 0; i < jsonData.length; ++i) {
      const cat: Cat = {
        id: jsonData[i].id,
        url: jsonData[i].url,
      };
      // insert the data twice so we can do the matchy-matchy
      doubledData.push(cat);
      doubledData.push(cat);
    }
    // then shuffle them about
    const shuffledArray = shuffle(doubledData);

    setCatData(shuffledArray);
  };

  useEffect(() => {
    api();
  }, []); // call when first loading the page

  function flipCard(url: string, index: number) {
    // check if they clicked the same card twice
    // don't do anything if so
    if (flippedCards.length === 1 && flippedCards[0].id === index) {
      return;
    }

    if (flippedCards.length < 2) {
      setFlippedCards((flippedCards) => [
        ...flippedCards,
        { id: index, url: url },
      ]);

      // if this is the second card
      if (flippedCards.length === 1) {
        setTurns((turns) => turns + 1);
        // Check if this is a match
        if (flippedCards[0].url === url) {
          // add both matched cards to the open cards array
          setMatchedCards((openCards) =>
            openCards.concat([flippedCards[0].url, url])
          );

          // this needs to be 18 because the number read as updated to 20 until the next turn
          if (matchedCards.length === 18) {
            setWin(true);
          }
        }
        // reset chosen cards and chosen ids and to empty to unflip them
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  }

  // returns true if this card is currently matched or flipped
  // which indicates it should be showing the cat (front) face
  function isCardChosen(image: string, index: number) {
    // is this card matched?
    const isMatched: boolean = matchedCards.includes(image);
    let isFlipped: boolean = false;

    // is this card flipped?
    for (let i = 0; i < flippedCards.length; ++i) {
      if (flippedCards[i].id === index) {
        isFlipped = true;
      }
    }

    return isFlipped || isMatched;
  }

  // reset all state and call the api to get new data
  function startOver() {
    setWin(false);
    setCatData([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setTurns(0);
    api();
  }

  function getStyles(url: string, index: number) {
    let path = cardBack;
    let transform = "";

    // I chose to call this just once instead of each time as a ternary
    // inside each of the return values since the function loops through
    // all the flipped cards
    if (isCardChosen(url, index)) {
      path = url;
      transform = "rotateY(180deg)";
    }

    return {
      backgroundImage: `url(${path})`,
      transform: `${transform}`,
    };
  }

  const catCards = catData.map((cat, index) => (
    <div
      className="cat-card"
      style={getStyles(cat.url, index)}
      key={index} // need to use the index because the ids are doubled
      onClick={() => flipCard(cat.url, index)}
    >
      <div className="front"></div>
      <div className="back" onClick={() => flipCard(cat.url, index)}></div>
    </div>
  ));

  return (
    <>
      {win && <Confetti />}
      <div className="game-container">
        <div className="game-info">
          <h1>Meow Match</h1>
          <p>Match the cats in the fewest number of turns!!</p>
          <h3>Turns: {turns}</h3>
          <button onClick={startOver}>Start over</button>
        </div>
        <div className="card-container">{catCards}</div>
      </div>
    </>
  );
}

export default App;
