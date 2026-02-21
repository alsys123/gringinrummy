//(function() {
  const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13];
  const suits = ["♣","♦","♥","♠"];

  const game = {
    deck: [],
    stock: [],
    discard: [],
    player: [],
    cpu: [],
    turn: "player",
    phase: "idle",
      drawn: null,
      revealCpu: false
  };

  let matchScore = {
    player: 0,
    cpu: 0,
    target: 100
  };

const detailedMatchScore = { games: [] };

let gCardDeck = "simple";
let gshowLog  = false;
const logHistory = [];

  const el = {
    msg: document.getElementById("message"),
    cpu: document.getElementById("cpu-hand"),
    player: document.getElementById("player-hand"),
    discard: document.getElementById("discard-top"),
    stock: document.getElementById("stock"),
    stockCount: document.getElementById("stock-count"),
    log: document.getElementById("log"),
    btnNew: document.getElementById("btn-new"),
//    btnDrawStock: document.getElementById("btn-draw-stock"),
//    btnDrawDiscard: document.getElementById("btn-draw-discard"),
    btnKnock: document.getElementById("btn-knock"),
    btnGin: document.getElementById("btn-gin"),
    btnNewMatch: document.getElementById("btn-newMatch"),
    deadwood: document.getElementById("deadwood-info"),
    scoreboard: document.getElementById("scoreboard")
  };

const allMeldResults = [];

function createDeck() {
  const d = [];
  for (const s of suits) {
    for (const r of ranks) {
      d.push({
        rank: r,
        suit: s,
        runValue: runValue(r),          // for runs
        deadwoodValue: deadwoodValue(r),// for scoring
        id: s + r
      });
    }
  }
  return d;
}

  function shuffle(a) {
    for (let i=a.length-1;i>0;i--) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
  }
    

  function cardValue(rank) {
    if (rank === 1) return 1;
    if (rank >= 11) return 10;
    return rank;
  }

  function prettyCard(c) {
    const r = {1:"A",11:"J",12:"Q",13:"K"}[c.rank] || c.rank;
    return r + c.suit;
  }

function asciiSuit(suit) {
    return {
        "♠": "S",
        "♥": "H",
        "♦": "D",
        "♣": "C"
    }[suit];
}
function asciiRankUpper(rank) {
    return {1:"A",11:"J",12:"Q",13:"K"}[rank] || rank;
    }

function asciiRank(rank) {
    return {1:"a",11:"j",12:"q",13:"k"}[rank] || rank;
}

/*
  // ORIGINAL --- no images ---
function cardFace(c) {
    const div = document.createElement("div");
    div.className = "card player-card";
    div.dataset.id = c.id;

    // ASCII-friendly filename
    const suitCode = asciiSuit(c.suit);
    const rankCode = asciiRank(c.rank);

    // Only set the image — everything else comes from CSS
    div.style.backgroundImage = `url('images/cards-svg/${rankCode}${suitCode}.svg')`;

    // Corner indices (still optional if you want them)
    const r = {1:"A",11:"J",12:"Q",13:"K"}[c.rank] || c.rank;
    const color = (c.suit==="♦"||c.suit==="♥") ? "red" : "black";

    const tl = document.createElement("div");
    tl.className = "corner";
    tl.innerHTML = `<div class="rank ${color}">${r}</div><div class="suit ${color}">${c.suit}</div>`;

    const br = tl.cloneNode(true);
    br.classList.add("bottom");

    div.appendChild(tl);
    div.appendChild(br);

    return div;
    }
    */

//__cardFace
function cardFace(c) {

    const suitCode = asciiSuit(c.suit);
    const rankCode = asciiRank(c.rank);
    const rankCodeUpper = asciiRankUpper(c.rank);

    
    const div = document.createElement("div");

    div.className = "card player-card";
    div.dataset.id = c.id;

    // set the default style to start
//    div.style.backgroundImage = `url('images/JumboCards/${rankCodeUpper}${suitCode}.jpg')`;
//    document.documentElement.style.setProperty("--card-height", "140px");

    //
    // Add full card face graphic
    //    div.style.backgroundImage = `url('images/cards-svg/${rankCodeUpper}${suitCode}.svg')`;
    if (gCardDeck === 'classic') {
	div.style.backgroundImage = `url('images/cards/Classic/${rankCodeUpper}${suitCode}.svg')`;
//	document.documentElement.style.setProperty("--card-height", "160px");

    }
    if (gCardDeck === 'simple') {
	div.style.backgroundImage = `url('images/cards/Simple/${c.suit}${rankCode}.png')`;
//	document.documentElement.style.setProperty("--card-height", "160px");

    }

    if (gCardDeck === 'jumbo') {
	div.style.backgroundImage = `url('images/cards/JumboCards/${rankCodeUpper}${suitCode}.jpg')`;
//	document.documentElement.style.setProperty("--card-height", "154px");
//	document.documentElement.style.setProperty("--card-width", "110px"); 
	
    }

    div.style.backgroundSize = "contain";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center";
        
/*
    const r = {1:"A",11:"J",12:"Q",13:"K"}[c.rank] || c.rank;
    const color = (c.suit==="♦"||c.suit==="♥") ? "red" : "black";
    
    const tl = document.createElement("div");
    tl.className = "corner";
    tl.innerHTML = `<div class="rank ${color}">${r}</div><div class="suit ${color}">${c.suit}</div>`;
    
    const br = tl.cloneNode(true);
    br.classList.add("bottom");
    
    div.appendChild(tl);
    div.appendChild(br);
    */
    return div;
}//cardFace



  function updateScoreboard() {
      //    el.scoreboard.textContent =
      //      `Score — You: ${matchScore.player} | CPU: ${matchScore.cpu}`;
      document.getElementById("score-you").textContent = matchScore.player;
      document.getElementById("score-cpu").textContent = matchScore.cpu;
      
      // Optional bump animation
      document.getElementById("score-you").classList.add("score-bump");
      document.getElementById("score-cpu").classList.add("score-bump");
      
      setTimeout(() => {
	  document.getElementById("score-you").classList.remove("score-bump");
	  document.getElementById("score-cpu").classList.remove("score-bump");
      }, 300);
      
  }
    

  /* ------------------------------
     Scoring + Tally
  ------------------------------ */

function applyScoring(result) {
    if (result.winner === "tie") {
	result.points = 0;
	updateScoreboard();

	addGameToDetailsScore(result.winner, result.type, result.who,
			      result.pDW, result.cDW, result.layoff,
			      result.originalDW);

	return result;
    }
    
    let points = 0;
    
    if (result.type === "gin") {
	points = 25 + (result.winner === "player" ? result.cDW : result.pDW);
    } else if (result.type === "knock") {
	const diff = Math.abs(result.pDW - result.cDW);
	if (result.winner === "player") points = diff;
	//      else points = 10 + diff;  .. no reason
	else points = diff;
    } else if (result.type === "stock") {
	points = Math.abs(result.pDW - result.cDW);
    } else if (result.type === "undercut") {
	points = 25 + (result.winner === "player" ? result.cDW : result.pDW);
    }
    
    matchScore[result.winner] += points;
    updateScoreboard();
    
    addGameToDetailsScore(result.winner, result.type, result.who,
			  result.pDW, result.cDW, result.layoff,
			  result.originalDW);
    
    result.points = points;

    
    return result;
} //applyScoring

//__addGameToDetailsScore
function addGameToDetailsScore(winner, type, who, pDW, cDW, newLayoff, originalDW) {
    // Determine bonus points
    let bonus = 0;
    let pointsThisGame = 0;

    // Accumulated totals
    const last = detailedMatchScore.games.at(-1);
    const prevPlayerPoints = last ? last.accumulated.player : 0;
    const prevCpuPoints    = last ? last.accumulated.cpu : 0;

    // bonus calc
    if (type === "gin")      bonus = 25;
    if (type === "undercut") bonus = 10;

    // deadwood calc
    if (winner === "player") dDW = cDW - pDW;
    if (winner === "cpu")    dDW = pDW - cDW;
    
  // Total original points (deadwood + bonus)
    pointsThisGame = dDW + bonus;

    if (winner === "player") {
	pPoints = prevPlayerPoints + pointsThisGame;
	cPoints = prevCpuPoints;
    }
    if (winner === "cpu")    {
	cPoints = prevCpuPoints + pointsThisGame;
	pPoints = prevPlayerPoints;
    }
    

//  const accumulated = {
//    player: prevPlayer + finalPoints.player,
//    cpu: prevCpu + finalPoints.cpu
//  };
    
    // Build the game entry
    const gameData = {
	gameNumber: detailedMatchScore.games.length + 1,
	winner, type, who,
	deadwood: {player: pDW, cpu: cDW, diff: dDW },
	bonus: { bonus, type },
	layoff: newLayoff,
	pointsThisGame,
	accumulated: {player: pPoints, cpu: cPoints},
	originalDW: originalDW
    };
    
    // Store it
    detailedMatchScore.games.push(gameData);
}//addGameToDetailsScore


//__ showHandTally
// maybe here  ... game.revealCpu = "true"
function showHandTally(result) {

    pointsThisHandCalc = "";

    // ???here i am
    //       console.log("Result: ", result.winner, ". Who: ", result.who);

    //    const actor = result.who;
    
    const actionText = {
	gin: {
	    player: "You went Gin!",
	    cpu: "CPU went Gin!"
	},
	knock: {
	    player: "You knocked.",
	    cpu: "CPU knocked."
	},
	stock: {
	    na: "Stock depleted."
	},
	undercut: {
	    player: "You knocked.",
	    cpu:    "CPU knocked."
	}
    };
    const resultText = {
	player: "You won the hand.",
	cpu: "CPU won the hand.",
	tie: "Deadwood tie."
    };
    
    const actor  = result.who;      // player, cpu, or na
    const winner = result.winner;  // player, cpu, tie
    const type   = result.type;      // gin, knock, stock, undercut

    let title = actionText[type][actor];

//    if (result.winner === "cpu" && result.who === "cpu" &&
//	result.type === "knock") {
//	title = "CPU Knocked and Won!";
//    }
    
    // Stock has no winner
    if (type !== "stock") {
	title += " " + resultText[winner];
    }

//    console.log("Result: ", result.winner, ". Who: ", result.who);

    if(result.who === "player" && result.winner === "player") {
	title = "You WON!";
    }
    if(result.who === "cpu" && result.winner === "cpu") {
	title = "CPU won!";
    }
    
//    layoff: layoffTotal,
//	  OriginalPDW: origPDW

    yourDeadwoodLine = `Your deadwood: ${result.pDW}`;
    cpuDeadwoodLine  = `CPU deadwood: ${result.cDW}`;

//    console.log("show it: ", actor, result.layoff, type);

    // about player layoffs
    if (actor === "cpu" && result.layoff > 0 && type === "knock") {
	yourDeadwoodLine = `Your deadwood: ${result.pDW}` +
	    ` (${result.originalDW} - ${result.layoff} layoffs)`;
    }
    
    if (actor === "cpu" && type === "knock" &&
	result.winner === "cpu") {
	pointsThisHandCalc =
	    " = ( " + `${result.pDW} - ${result.cDW}` + " )";
    }

    // about CPU layoffs
    if (actor === "player" && result.layoff > 0 && type === "knock") {
	cpuDeadwoodLine  = `CPU deadwood: ${result.cDW}` +
	    ` (${result.originalDW} - ${result.layoff} layoffs)`;
	pointsThisHandCalc =
	    " = ( " + `${result.cDW} - ${result.pDW}` + " )";
    } 

    if (actor === "player" && type === "knock" &&
	result.winner === "player") {
	pointsThisHandCalc =
	    " = ( " + `${result.cDW} - ${result.pDW}` + " )";
    } 

    if (actor === "cpu" && result.type === "gin") {
	pointsThisHandCalc = " = ( " + `${result.pDW} + 25 Bonus points for gin` + " )";
    }
    if (actor === "cpu" && result.type === "undercut") {
	pointsThisHandCalc = " = ( " + `${result.cDW} + 10 Bonus points for an undercut` + " )";
    }
    
    if (actor === "player" && result.type === "gin") {
	pointsThisHandCalc = " = ( " + `${result.cDW} + 25 Bonus points for gin` + " )";
    }
    if (actor === "player" && result.type === "undercut") {
	pointsThisHandCalc = " = ( " + `${result.pDW} + 10 Bonus points for an undercut` + " )";
    }

    const tally =
	  " - - - Game Card - - - " + "\n" + "\n" +
	  `${title}\n\n` +
	  yourDeadwoodLine + "\n" +
	  cpuDeadwoodLine  + "\n" +
	  "\n" +
	  `Points this hand: ${result.points} ` + 
	  pointsThisHandCalc + "\n\n" +
	  `Match Score:\n` +
	  `You: ${matchScore.player}\n` +
	  `CPU: ${matchScore.cpu}`;
    
    //     alert(tally);
    showMessage(tally);
    //      showMessage("We have a tally");

    
} //showHandTally

//__ checkMatchEnd
    function checkMatchEnd() {
	if (matchScore.player >= matchScore.target) {
	    showMessage(`You win the match! Final score: You ${matchScore.player} — CPU ${matchScore.cpu}`);
//old	    document.getElementById("btn-new").textContent = "New Game";
	    document.getElementById("btn-newMatch").textContent = "New MATCH";
//??	    resetMatch();
	} else if (matchScore.cpu >= matchScore.target) {
	    showMessage(`CPU wins the match! Final score: CPU ${matchScore.cpu} — You ${matchScore.player}`);
//old	    document.getElementById("btn-new").textContent = "New Game";
	    document.getElementById("btn-newMatch").textContent = "New MATCH";
	    //??	    resetMatch();
	    /// ??? check THIS SEEMS -- REPEATED in error
	} else if (matchScore.cpu >= matchScore.target) {
	    showMessage(`CPU wins the match! Final score: CPU ${matchScore.cpu} — You ${matchScore.player}`);
	    
	}
	
    } //checkMatchEnd
    
  function resetMatch() {
      matchScore.player = 0;
      matchScore.cpu = 0;

      detailedMatchScore.games = []; // now reset previous scoreboard

      updateScoreboard();
      
  }

  /* ------------------------------
     Rendering
  ------------------------------ */


//__ updateButtons
function updateButtons() {
    
    log("Update Buttons", "sys");
    
	const t = game.turn === "player";
	const p = game.phase;

	document.getElementById("btn-knock").style.visibility = "hidden";  // hide
	document.getElementById("btn-gin").style.visibility = "hidden";

	// player - await-discard
      if (t && p === "await-discard") {

	  const evalPlayer = evaluate(game.player);
	   
	  if (evalPlayer.deadwood === 0)
	      document.getElementById("btn-gin").style.visibility = "visible"; // show
	  if (evalPlayer.deadwood <= 10 && evalPlayer.deadwood > 0)
	      document.getElementById("btn-knock").style.visibility = "visible";
	  
	  // hide
	  document.getElementById("btn-new").style.display = "none";
	  document.getElementById("btn-newMatch").style.display = "none";
	  return;
      }

	/// try this one out .. if play and awaiting to draw
	if (t && p === "await-draw") {

	    const evalPlayer = evaluate(game.player);
	    
	    if (evalPlayer.deadwood === 0)
		document.getElementById("btn-gin").style.visibility = "visible";
	    if (evalPlayer.deadwood <= 10 && evalPlayer.deadwood > 0)
		document.getElementById("btn-knock").style.visibility = "visible";
	    
	    // hide
	    document.getElementById("btn-new").style.display = "none";
	    document.getElementById("btn-newMatch").style.display = "none";
	    return;
	}

//    console.log("state: ", game);

    // show by default
    // either a new game or a new match
    const playerWon = matchScore.player >= matchScore.target;
    const cpuWon = matchScore.cpu >= matchScore.target;
    
    const matchOverFlag = playerWon || cpuWon;
    
//    console.log("flag: ", game.phase,
//		matchOverFlag,
//		matchScore.player,playerWon,
//		matchScore.cpu,   cpuWon);

    // Hide both by default
    document.getElementById("btn-new").style.display = "none";
    document.getElementById("btn-newMatch").style.display = "none";
    // If match is over → show New Match
    if (matchOverFlag && game.phase === "round-over") {
	document.getElementById("btn-newMatch").style.display = "";
	return;
    }
    // If match is NOT over → show New Game
    if (!matchOverFlag) {
	document.getElementById("btn-new").style.display = "";
	return;
    }
/*    
    //game.phase could be await draw 
    if (!matchOverFlag ) {
	document.getElementById("btn-new").style.display = "";  // New Game
	console.log("set new GAME!");
    }

    if (game.phase === "round-over" && matchOverFlag ) {
	document.getElementById("btn-newMatch").style.display = ""; // New Match
//	console.log("new match");
    }
*/
    
// hide by default
	document.getElementById("btn-knock").style.visibility = "hidden";
	document.getElementById("btn-gin").style.visibility = "hidden";

	
  } // updateButtons

    
  /* ------------------------------
     Game Flow
  ------------------------------ */

function newMatch() {
    log("newMatch: new game");
    resetMatch();
    start();
    //    return; /// nothing for now
}

function start() {

    log("start: new hand or game");
    
    game.deck = createDeck();
    shuffle(game.deck);
    
    //      rigDeckForTesting(game.deck);
    
    game.player = [];
    game.cpu = [];
    game.stock = [];
    game.discard = [];

    // not sure ??? 
//    detailedMatchScore.games = []; // now reset previous scoreboard

    game.turn = "player";
    game.phase = "await-draw";
      game.drawn = null;
      game.revealCpu = false;

//      el.log.innerHTML = ""; // clears the log

    for (let i=0;i<10;i++) {
      game.player.push(game.deck.pop());
      game.cpu.push(game.deck.pop());
    }

    game.discard.push(game.deck.pop());
    while (game.deck.length) game.stock.push(game.deck.pop());

   //   console.log("closeModal is", window.closeModal);
      
//      showMessage(`Here we go\na and another new line\n the end\n\n`);
      
      setMsg("Your turn: draw from stock or discard. New hand started.");

//      updateButtons();


//      checkMatchEnd();
      
      //   log("New hand started.");

    // test data
    
    //winner, type, who, pDW, cDW, layoff, originalDW);
//    addGameToDetailsScore("player","knock", "player",  8,  35,  3, 38);
//    addGameToDetailsScore("cpu",   "knock", "cpu",    15,   9,  0, 9);
//    addGameToDetailsScore("cpu",   "knock", "cpu",    0,   9,  6, 15);
//    addGameToDetailsScore("cpu",   "Gin",   "cpu",    45,   0,  0, 0);
      
    render();
    updateButtons();
}//start

    //__ drawStock
    function drawStock() {
	if (game.turn!=="player" || game.phase!=="await-draw") return;
	if (!game.stock.length) return;
	const c = game.stock.pop();
	game.player.push(c);
	game.drawn = c;
	
	log("You drew from stock: " + prettyCard(c), "player" );
	
	game.phase = "await-discard";
	setMsg("Click a card to discard, or Knock/Gin if available.");
	render();
	updateButtons();
    } //drawStock
    
    function drawDiscard() {
	if (game.turn!=="player" || game.phase!=="await-draw") return;
	if (!game.discard.length) return;
	const c = game.discard.pop();
	game.player.push(c);
	game.drawn = c;
	log("You drew " + prettyCard(c) + " from discard.", "player");
	
	game.drawn = c.id;  //... not sure this is right?
	
	game.phase = "await-discard";
	setMsg("Click a card to discard, or Knock/Gin if available.");
	render();
	updateButtons();
  }

//_ playerDiscard
function playerDiscard(id) {
    if (game.turn!=="player" || game.phase!=="await-discard") return;
    const i = game.player.findIndex(c=>c.id===id);
    if (i<0) return;
    const [c] = game.player.splice(i,1);
    game.discard.push(c);
    log("You discarded " + prettyCard(c) + ".", "player");
    
    game.drawn = c.id;
    
    game.drawn = null;
    
    endPlayerTurn();
} //playerDiscard

  function endPlayerTurn() {
    if (game.stock.length <= 2) {
      stockDepletionResolution();
      return;
    }
    game.turn = "cpu";
    game.phase = "await-draw";
    setMsg("CPU thinking...");
      render();
      updateButtons();
   // setTimeout(cpuTurn, 650);
    setTimeout(cpuTurn, 0);
  }

  function stockDepletionResolution() {
    const pEval = evaluate(game.player);
    const cEval = evaluate(game.cpu);
    const pDW = pEval.deadwood;
    const cDW = cEval.deadwood;

    let winner = "tie";
    if (pDW < cDW) winner = "player";
    else if (pDW > cDW) winner = "cpu";

      const scored = applyScoring({
	  winner,
	  type: "stock",
	  pDW,
	  cDW,
	who: "na"
      });

//      console.log("ehh ..show cpu prepre!",game.revealCpu);

//      commonEventEnd(scored, "Hand over. Click New Hand to play again.");
		     
      showHandTally(scored);
      checkMatchEnd();
      game.phase = "round-over";
      setMsg("Hand over. Click New Hand to play again.");

      render();
      updateButtons();
  } //stockDepletionResolution

  /* ------------------------------
     Knock + Gin
  ------------------------------ */

function commonEventEnd(scored, Message) {

//    game.revealCpu = true;  .. should have done this earlier??

    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
    setMsg(Message);
    
    updateButtons();

    //    render();  .. should have done this earlier??
    
} //commonEventEnd

//__ playerKnock
function playerKnock() {
    const cEval = evaluate(game.cpu);
    let pEval = evaluate(game.player);

    let cDW = cEval.deadwood;
    
    let pDW = pEval.deadwood; 
    let origCDW = cDW;

    game.revealCpu = true;
    render();
    updateButtons();
    
    /*
    if (game.player.length > 10) {
	showMessage("Sorry cannot do anything yet.  Player has more than 10 cards.");
	return;
    }
    */
    
    if (game.player.length > 10) {
	// Auto-discard highest deadwood card
//	pEval = evaluate(game.player);
	const deadwoodCards = pEval.deadwoodCards;
	
	if (deadwoodCards.length > 0) {
            // Sort descending by value
        deadwoodCards.sort((a, b) => b.deadwoodValue - a.deadwoodValue);
            const highest = deadwoodCards[0];
	    
            playerDiscard(highest.id);
            render(); // update UI
	    updateButtons();
	}

	// reset these because we just removed a card
	pEval = evaluate(game.player);
	pDW = pEval.deadwood; 
	origCDW = cDW;

    } // if more than 10 cards

    
    // not really possible but good to have here.
    if (pEval.deadwood > 10) {
	showMessage("You can only knock with deadwood 10 or less.");
	return;
    }
   
    
    const playerMeldCards = expandMelds(game.player, pEval.melds);
    const CpuDeadwood     = cEval.deadwoodCards;
    
    const layoffCards     = getLayoffs(CpuDeadwood, playerMeldCards);
    const layoffTotal     = layoffValue(layoffCards);

//    console.log( playerMeldCards, CpuDeadwood, layoffCards, layoffTotal)

    markCPULayoffCards(layoffCards);  // pop the cards up to show a layoff
     
    cDW = cDW - layoffTotal;
   
    let winner = "tie";
    let finalType = "knock";
    if (pDW < cDW)      winner = "player";
    else if (pDW > cDW) {
	winner = "cpu";
	finalType = "undercut";
    }

    const scored = applyScoring({
	winner,
	type: finalType,
	pDW,
	cDW,
	who: "player",
	layoff: layoffTotal,
	originalDW: origCDW
    });

//    let msg;
//    log(msg);

    
    commonEventEnd(scored,"Hand over. Click New Hand to play again.");

    /*
    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
    setMsg("Hand over. Click New Hand to play again.");

    updateButtons();
    */
    
//    render(); // out for now
  } // playerKnock


function playerGin() {
    
    if (game.turn!=="player" || game.phase!=="await-draw") return;

    const pEval = evaluate(game.player);
    if (pEval.deadwood !== 0) {
	//alert("Gin requires 0 deadwood.");
      showMessage("Gin requires 0 deadwood.");
      return;
    }
    const cEval = evaluate(game.cpu);
    const cDW = cEval.deadwood;

    const scored = applyScoring({
      winner: "player",
      type: "gin",
      pDW: pEval.deadwood,
	cDW,
	who: "player"
    });

//    commonEventEnd(scored,"You had Gin! Click New Hand to play again.");
    
    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
    game.revealCpu = true;
    
    setMsg("You had Gin! Click New Hand to play again.");
      
    render();
    updateButtons();
  } //playerGin

  /* ------------------------------
     CPU Turn + AI
  ------------------------------ */

  async function cpuTurn() {
    if (game.phase === "round-over") return;

    const evalCpu = evaluate(game.cpu);
    const cDW = evalCpu.deadwood;

    if (cDW === 0) {
      cpuGin();
      return;
    }
    if (cDW <= 7) {
      cpuKnock();
      return;
    }

    let drawn;
    const topDiscard = game.discard[game.discard.length-1];

      if (topDiscard) {
      const hypothetical = [...game.cpu, topDiscard];
      const evalWith = evaluate(hypothetical);
      if (evalWith.deadwood + 1 <= cDW) {
        drawn = game.discard.pop();
          log("CPU drew " + prettyCard(drawn) + " from discard.","cpu");

//  animateCpuTakeFromDiscard(drawn);

      }
    }// if from topDiscard
      
    if (!drawn) {
      if (!game.stock.length) {
        stockDepletionResolution();
        return;
      }
	drawn = game.stock.pop();

//animateCpuTakeFromStock(drawn);
	
	log("CPU drew from stock.","cpu");
    }
      
      game.cpu.push(drawn);
      
//      await sleep(3000);

    const idx = cpuChooseDiscardIndex();
    const [d] = game.cpu.splice(idx,1);

//      animateCpuToDiscard(d);

//      console.log("CPU discarded 1 - " + prettyCard(d) + ".");
//      showMessage("CPU discarded 1 - " + prettyCard(d) + ".");

     cpuDiscardAnimate(d);  // Animate the discard

//      await sleep(1000);
      
     game.discard.push(d);

//      console.log("CPU discarded 2 - " + prettyCard(d) + ".");
//      showMessage("CPU discarded 2 - " + prettyCard(d) + ".");

      log("CPU discarded " + prettyCard(d) + ".","cpu");
      game.turn = "player";
      game.phase = "await-draw";
      setMsg("Draw from stock or discard.");

      updateButtons();
      await sleep(1000);

     render();
      updateButtons();
      
  } // cpuTurn



function cpuChooseDiscardIndex() {
    const hand = game.cpu;
    const sorted = sortHandByRank(hand);
    const evalInfo = evaluate(sorted);
    const meldIds = meldCardIds(sorted, evalInfo);

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i=0;i<sorted.length;i++) {
      const c = sorted[i];
      const v = cardValue(c.rank);
      const isMeld = meldIds.has(c.id);
      const meldPenalty = isMeld ? -10 : 0;
      const lowPenalty = (c.rank <= 4 ? -1 : 0);
      const score = v + meldPenalty + lowPenalty;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const targetId = sorted[bestIndex].id;
    const realIndex = hand.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
  }

  function cpuGin() {
    const pEval = evaluate(game.player);
    const pDW = pEval.deadwood;

      const scored = applyScoring({
	  winner: "cpu",
	  type: "gin",
	  pDW,
	  cDW: 0,
	  who: "cpu"
      });
      
      log("CPU went Gin.","cpu");

//      game.revealCpu = "true";  ........... here i am .. revealing CPU cards

      //    commonEventEnd(scored,"CPU went Gin. Click New Hand to play again.");

      game.revealCpu = true;
      
      showHandTally(scored);
      checkMatchEnd();
      game.phase = "round-over";
      setMsg("CPU went Gin. Click New Hand to play again.");
      
      render();
      updateButtons();
  } //cpuGin

    //__ cpuKnock
function cpuKnock() {
    const cEval = evaluate(game.cpu);
    const pEval = evaluate(game.player);
    const cDW = cEval.deadwood;
    
    let   pDW = pEval.deadwood;
    const origPDW = pDW;
    
    game.revealCpu = true;
    render();
    updateButtons();
    
    const cpuMeldCards   = expandMelds(game.cpu, cEval.melds);
    const playerDeadwood = pEval.deadwoodCards;
    
    const layoffCards = getLayoffs(playerDeadwood, cpuMeldCards);
    const layoffTotal = layoffValue(layoffCards);
    
    markPlayerLayoffCards(layoffCards);  // pop the cards up to show a layoff
    
    pDW = pDW - layoffTotal;
    
    let winner = "tie";
    let finalType = "knock";
    
    if (cDW < pDW) winner = "cpu";
    else if (cDW > pDW) {
	winner = "player";
	finalType = "undercut";
    }
    
    const scored = applyScoring({
	winner,
	type: finalType,
	pDW,
	cDW,
	who: "cpu",
	layoff: layoffTotal,
	originalDW: origPDW
    });
    
    let msg;
    if (cDW < pDW) {
	msg = "CPU knocked and wins.\nCPU: " + cDW + " | You: " + pDW;
    } else if (cDW > pDW) {
	msg = "CPU knocked but you have less deadwood!\nCPU: " + cDW + " | You: " + pDW;
    } else {
	msg = "CPU knocked. Deadwood tie.\nCPU: " + cDW + " | You: " + pDW;
    }
    log(msg,"cpu");

    //    commonEventEnd(scored,"CPU knocked. Click New Hand to play again.");
    
    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
    setMsg("CPU knocked. Click New Hand to play again.");
    // .. for now    render();
  } //cpuKnock


/*  ****
    Layoff functions
*/
function expandMelds(hand, melds) {
  return melds.map(meld => meld.map(i => hand[i]));
}

//__ getLayoffs
function getLayoffs(playerORCpuDeadwood, cpuORPlayerMelds) {
  const layoffs = [];

  for (const card of playerORCpuDeadwood) {
    for (const meld of cpuORPlayerMelds) {

      // --- SET MELD ---
      if (isSetMeld(meld)) {
        if (card.rank === meld[0].rank) {
          layoffs.push(card);
          break;
        }
      } //if set

      // --- RUN MELD ---
      if (isRunMeld(meld)) {
        if (card.suit !== meld[0].suit) continue;

        const ranks = meld.map(c => c.rank).sort((a,b)=>a-b);
        const low = ranks[0];
        const high = ranks[ranks.length-1];

        if (card.rank === low - 1 || card.rank === high + 1) {
          layoffs.push(card);
          break;
        }

      }// if meld
	
    } // for melds
      
  } // for deadwood

  return layoffs;
}

function isSetMeld(meld) {
  return meld.length >= 3 &&
         meld.every(c => c.rank === meld[0].rank);
}

function isRunMeld(meld) {
  if (meld.length < 3) return false;
  const suit = meld[0].suit;
  if (!meld.every(c => c.suit === suit)) return false;

  const ranks = meld.map(c => c.rank).sort((a,b)=>a-b);
  for (let i=1;i<ranks.length;i++) {
    if (ranks[i] !== ranks[i-1] + 1) return false;
  }
  return true;
}

function layoffValue(cards) {
  return cards.reduce((sum, c) => sum + cardValue(c.rank), 0);
}

/* ****

   Utils
   
 */

function showMessage(msg) {
	const padded = msg + "\n\n"; // always add two newlines
	document.getElementById("modal-text").textContent = padded;
	document.getElementById("modal").style.display = "flex";
} // showMessage


//    add the handlers
document.getElementById("stock").onclick = () => {
    if (game.turn === "player") {
	drawStock();
	//	console.log("stock draw");
    }
};  // handler stock

document.getElementById("discard-top").onclick = () => {
    if (game.turn === "player") {
        drawDiscard();
	//	console.log("discard draw");
    }
}; // handler discard

  /* ------------------------------
     Event Wiring
  ------------------------------ */

el.btnNew.onclick = start;
//--  el.btnDrawStock.onclick = drawStock;
//--  el.btnDrawDiscard.onclick = drawDiscard;
el.btnKnock.onclick = playerKnock;
el.btnGin.onclick = playerGin;

el.btnNewMatch.onclick = newMatch;

updateScoreboard();
render();
updateButtons();
//})();

// functions global ...

   function closeModal() {
//	console.log("in close");
       document.getElementById("modal").style.display = "none";
       // Remove temporary content
       document.getElementById("modal-extra").innerHTML = "";
    }

function layoutStars() {
	// 🥹
//  const game = document.getElementById("game");
//  const w = game.clientWidth;
//  const h = game.clientHeight;
const h = window.innerHeight;
const w = window.innerWidth;
	
  const margin = 0.05;   // 5%

  const tl = document.getElementById("star-tl");
  const tr = document.getElementById("star-tr");
  const bl = document.getElementById("star-bl");
  const br = document.getElementById("star-br");
//  const ml = document.getElementById("star-midleft");

  // Top-left
    tl.style.left = (w * margin)-20 + "px";
  tl.style.top  = (h * margin) + "px";

  // Top-right
  tr.style.left = (w * (1 - margin)) + "px";
  tr.style.top  = (h * margin) + "px";

  // Bottom-left
  bl.style.left = (w * margin) + "px";
  bl.style.top  = (h * (1 - margin)) + "px";

  // Bottom-right
  br.style.left = (w * (1 - margin)) + "px";
  br.style.top  = (h * (1 - margin)) + "px";

  // Mid-left (50% down, 5% in)
//  ml.style.left = (w * margin) + "px";
//  ml.style.top  = (h * 0.5) + "px";
}

window.addEventListener("load", layoutStars);
window.addEventListener("resize", layoutStars);

//__ layoutTitle
function layoutTitle() {
    const title = document.getElementById("title");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5%
    
//  title.style.position = "absolute";
  title.style.left = (w * margin) + "px";
    title.style.top = (h * 0.02) + "px";
    
}//layoutTitle


window.addEventListener("load",   layoutTitle);
window.addEventListener("resize", layoutTitle);

// New Game
//__ layoutButton
function layoutButton() {
    return;   // delete me soon!!!
}//layoutButton

window.addEventListener("load", layoutButton);
window.addEventListener("resize", layoutButton);

// knock
//__ layoutButton
function layoutButtonKnock() {
    return;   // delete me soon!!!
/*    const btn = document.getElementById("btn-knock");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5% .. take into account button size
    const bw = btn.offsetWidth;
     const bh = btn.offsetHeight;
    const extraOffset = 20;

    //  title.style.position = "absolute";
    btn.style.left = (w * (1 - margin) - bw - extraOffset) + "px";
    btn.style.top = (h * 0.5 - bh / 2) + "px";
*/    
}//layoutButton

window.addEventListener("load", layoutButtonKnock);
window.addEventListener("resize", layoutButtonKnock);

//gin
//__ layoutButtonGin
function layoutButtonGin() {
    return;   // delete me soon!!!
/*    const btn = document.getElementById("btn-gin");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5% .. take into account button size
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const extraOffset = 20;

    //  title.style.position = "absolute";
    btn.style.left = (w * (1 - margin) - bw - extraOffset) + "px";
    btn.style.top = (h * 0.5 - bh / 2) + "px";
*/    
}//layoutButtonGin

window.addEventListener("load", layoutButtonGin);
window.addEventListener("resize", layoutButtonGin);


//window.allResultsPlayer = [];
// Click on scoreboard
document.querySelector(".scoreboard").addEventListener("click", () => {
  scoreBoardDetails(); 
});

document.getElementById("title").addEventListener("click", () => {
    document.getElementById("title").addEventListener("click", () => {
//	const extra = document.getElementById("modal-extra");
//	extra.innerHTML = `
//        <iframe src="gameRules.pdf" style="width:100%; height:70vh; border:none;"></iframe>
//    `;
	//	showMessage("Game Rules");
	showRules();
    });
    
});

