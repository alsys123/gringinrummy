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
	document.documentElement.style.setProperty("--card-height", "160px");

    }
    if (gCardDeck === 'simple') {
	div.style.backgroundImage = `url('images/cards/Simple/${c.suit}${rankCodeUpper}.png')`;
	document.documentElement.style.setProperty("--card-height", "160px");

    }

    if (gCardDeck === 'jumbo') {
	div.style.backgroundImage = `url('images/cards/JumboCards/${rankCodeUpper}${suitCode}.jpg')`;
	document.documentElement.style.setProperty("--card-height", "154px");
	document.documentElement.style.setProperty("--card-width", "110px"); 
	
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


function log(t) {
    const p = document.createElement("p");
    p.textContent = t;
    el.log.prepend(p);
  }

  function setMsg(t) {
    el.msg.textContent = t;
  }

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

	addGameToDetailsScore(result.winner,result.type,result.who,result.pDW,result.cDW);

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
    }
    
    matchScore[result.winner] += points;
    updateScoreboard();
    
    addGameToDetailsScore(result.winner,result.type,result.who,result.pDW,result.cDW);
    
    result.points = points;

    
    return result;
} //applyScoring

//__addGameToDetailsScore
function addGameToDetailsScore(winner, type, who, pDW, cDW) {
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
	layoff: {player: 0, cpu: 0 },
	pointsThisGame,
	accumulated: {player: pPoints, cpu: cPoints}
    };
    
    // Store it
    detailedMatchScore.games.push(gameData);
}//addGameToDetailsScore


//__ showHandTally
// maybe here  ... game.revealCpu = "true"
function showHandTally(result) {
    //    console.log("Result: ", result);
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
	}
    };
    const resultText = {
	player: "You won the hand.",
	cpu: "CPU won the hand.",
	tie: "Deadwood tie."
    };
    
    const actor = result.who;      // player, cpu, or na
    const winner = result.winner;  // player, cpu, tie
    const type = result.type;      // gin, knock, stock
    
    let title = actionText[type][actor];
    
    // Stock has no winner
    if (type !== "stock") {
	title += " " + resultText[winner];
    }
    
    /*    
	  let title = "";
    if (result.type === "gin") {
    title = result.winner === "player" ? "You went Gin!" : "CPU went Gin!";
    } else if (result.type === "knock") {
    if (result.winner === "player") title = "You won by knocking!";
    else if (result.winner === "cpu") title = "CPU won by knocking!";
    else title = "Knock — deadwood tie.";
    } else if (result.type === "stock") {
    title = "Stock depleted";
    }
    */
    
    const tally =
	  `${title}\n\n` +
	  `Your deadwood: ${result.pDW}\n` +
	  `CPU deadwood: ${result.cDW}\n\n` +
	  `Points this hand: ${result.points}\n\n` +
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
	    document.getElementById("btn-new").textContent = "New Game";
	resetMatch();
	} else if (matchScore.cpu >= matchScore.target) {
	    showMessage(`CPU wins the match! Final score: CPU ${matchScore.cpu} — You ${matchScore.player}`);
	    document.getElementById("btn-new").textContent = "New Game";
	    resetMatch();
	} else if (matchScore.cpu >= matchScore.target) {
	    showMessage(`CPU wins the match! Final score: CPU ${matchScore.cpu} — You ${matchScore.player}`);

	}
	
    } //checkMatchEnd
    
  function resetMatch() {
      matchScore.player = 0;
      matchScore.cpu = 0;

      updateScoreboard();
      
  }

  /* ------------------------------
     Rendering
  ------------------------------ */


    //__ updateButtons
    function updateButtons() {
	
//	console.log("updateButtons game.turn = ",game.turn );
	
	const t = game.turn === "player";
	const p = game.phase;
	
//	el.btnKnock.disabled = true;
	//	el.btnGin.disabled   = true;
	//hide
//	document.getElementById("btn-knock").style.display = "none";  // hide
//	document.getElementById("btn-gin").style.display = "none";
	document.getElementById("btn-knock").style.visibility = "hidden";  // hide
	document.getElementById("btn-gin").style.visibility = "hidden";

	// player - await-discard
      if (t && p === "await-discard") {

	  const evalPlayer = evaluate(game.player);
	   
//	  if (evalPlayer.deadwood === 0) el.btnGin.disabled = false;
//	  if (evalPlayer.deadwood <= 10) el.btnKnock.disabled = false;
	  if (evalPlayer.deadwood === 0)
	      document.getElementById("btn-gin").style.visibility = "visible"; // show
	  if (evalPlayer.deadwood <= 10 && evalPlayer.deadwood > 0)
	      document.getElementById("btn-knock").style.visibility = "visible";
	  
	  // hide
	  document.getElementById("btn-new").style.display = "none";
	  // show it
//	  document.getElementById("btn-knock").style.display = "";
//	  document.getElementById("btn-gin").style.display = "";
	  return;
      }

	/// try this one out .. if play and awaiting to draw
	if (t && p === "await-draw") {

	    const evalPlayer = evaluate(game.player);
	    
//	  console.log("here i am ... with deadwood=", evalPlayer.deadwood);
	    
	    if (evalPlayer.deadwood === 0)
		document.getElementById("btn-gin").style.visibility = "visible";
	    if (evalPlayer.deadwood <= 10 && evalPlayer.deadwood > 0)
		document.getElementById("btn-knock").style.visibility = "visible";
	    
	    // hide
	    document.getElementById("btn-new").style.display = "none";
	    // show it
// 	    document.getElementById("btn-knock").style.display = "none";
//	    document.getElementById("btn-gin").style.display = "none";
	    return;
	}

	// show by default
	document.getElementById("btn-new").style.display = "";
	// hide by default
	document.getElementById("btn-knock").style.visibility = "hidden";
	document.getElementById("btn-gin").style.visibility = "hidden";

	
  } // updateButtons

    
  /* ------------------------------
     Game Flow
  ------------------------------ */

function start() {
    game.deck = createDeck();
    shuffle(game.deck);
    
    //      rigDeckForTesting(game.deck);
    
    game.player = [];
    game.cpu = [];
    game.stock = [];
    game.discard = [];

    detailedMatchScore.games = []; // now reset previous scoreboard

    game.turn = "player";
    game.phase = "await-draw";
      game.drawn = null;
      game.revealCpu = false;

      el.log.innerHTML = "";

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
//      addGameToDetailsScore("player","knock", "player",  8,  35);
//      addGameToDetailsScore("cpu",   "knock", "cpu",    15,   9);
//      addGameToDetailsScore("cpu",   "knock", "cpu",    15,   9);
//      addGameToDetailsScore("cpu",   "Gin", "cpu",    45,   0);
      
    render();
}//start

    //__ drawStock
    function drawStock() {
	if (game.turn!=="player" || game.phase!=="await-draw") return;
	if (!game.stock.length) return;
	const c = game.stock.pop();
	game.player.push(c);
	game.drawn = c;
	
	log("You drew from stock: " + prettyCard(c) );
	
	game.phase = "await-discard";
	setMsg("Click a card to discard, or Knock/Gin if available.");
	render();
    } //drawStock
    
    function drawDiscard() {
	if (game.turn!=="player" || game.phase!=="await-draw") return;
	if (!game.discard.length) return;
	const c = game.discard.pop();
	game.player.push(c);
	game.drawn = c;
	log("You drew " + prettyCard(c) + " from discard.");
	
	game.drawn = c.id;  //... not sure this is right?
	
	game.phase = "await-discard";
	setMsg("Click a card to discard, or Knock/Gin if available.");
	render();
  }
    
function playerDiscard(id) {
    if (game.turn!=="player" || game.phase!=="await-discard") return;
    const i = game.player.findIndex(c=>c.id===id);
    if (i<0) return;
    const [c] = game.player.splice(i,1);
    game.discard.push(c);
    log("You discarded " + prettyCard(c) + ".");
    
    game.drawn = c.id;
    
    game.drawn = null;
    
    endPlayerTurn();
}

  function endPlayerTurn() {
    if (game.stock.length <= 2) {
      stockDepletionResolution();
      return;
    }
    game.turn = "cpu";
    game.phase = "await-draw";
    setMsg("CPU thinking...");
    render();
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
	 
      showHandTally(scored);
      checkMatchEnd();
      game.phase = "round-over";
      setMsg("Hand over. Click New Hand to play again.");

    render();
  }

  /* ------------------------------
     Knock + Gin
  ------------------------------ */

    //__ playerKnock
function playerKnock() {
    
	game.revealCpu = true;

//	console.log("I just knocked");
//	console.log("game.turn=",game.turn);
//	console.log("game.phase=", game.phase);

//	if (game.turn!=="player" || game.phase!=="await-discard") return;
//	if (game.turn!=="player") return;

//	console.log("at a");

	const pEval = evaluate(game.player);

	if (pEval.deadwood > 10) {
//      alert("You can only knock with deadwood 10 or less.");
      showMessage("You can only knock with deadwood 10 or less.");
      return;
    }

//		console.log("at b");

    const cEval = evaluate(game.cpu);

	const pDW = pEval.deadwood; 
	const cDW = cEval.deadwood;

	// .... here i am ... the deadwood for cpu is off .. test 1

    let winner = "tie";
    if (pDW < cDW) winner = "player";
    else if (pDW > cDW) winner = "cpu";

    const scored = applyScoring({
      winner,
      type: "knock",
      pDW,
	cDW,
	who: "player"
    });

    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
	setMsg("Hand over. Click New Hand to play again.");

    render();
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

      showHandTally(scored);


    checkMatchEnd();
      game.phase = "round-over";
      game.revealCpu = true;

      setMsg("You had Gin! Click New Hand to play again.");
      
    render();
  }

  /* ------------------------------
     CPU Turn + AI
  ------------------------------ */

  function cpuTurn() {
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
          log("CPU drew " + prettyCard(drawn) + " from discard.");
//	   animateCpuTakeFromDiscard(drawn);
      }
    }// if from topDiscard
      
    if (!drawn) {
      if (!game.stock.length) {
        stockDepletionResolution();
        return;
      }
	drawn = game.stock.pop();
//	animateCpuTakeFromStock(drawn);
	log("CPU drew from stock.");
    }
      
    game.cpu.push(drawn);

    const idx = cpuChooseDiscardIndex();
    const [d] = game.cpu.splice(idx,1);

//      animateCpuToDiscard(d);

//      console.log("CPU discarded 1 - " + prettyCard(d) + ".");
//      showMessage("CPU discarded 1 - " + prettyCard(d) + ".");

//     cpuDiscard(d);  //... not quite right but the right idea ???
      
      game.discard.push(d);

//      console.log("CPU discarded 2 - " + prettyCard(d) + ".");
//      showMessage("CPU discarded 2 - " + prettyCard(d) + ".");

      log("CPU discarded " + prettyCard(d) + ".");
      game.turn = "player";
      game.phase = "await-draw";
      setMsg("Draw from stock or discard.");
      
      render();
      
      
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

      log("CPU went Gin.");
      game.revealCpu = true;

//      game.revealCpu = "true";  ........... here i am .. revealing CPU cards
      
      showHandTally(scored);
      checkMatchEnd();
      game.phase = "round-over";
      setMsg("CPU went Gin. Click New Hand to play again.");
      
      render();
  } //cpuGin

    //__ cpuKnock
  function cpuKnock() {
    const cEval = evaluate(game.cpu);
    const pEval = evaluate(game.player);
    const cDW = cEval.deadwood;
    const pDW = pEval.deadwood;

      game.revealCpu = true;

      //??? here .. can any of these deadwood add to the cpuMeld cards
//???      pEval.deadwoodCards .. these are players deadwood...
      /// something like:
/*
    const evalCpu    = evaluate(game.cpu);
    const cpuMeldCardIds = evalCpu.melds
	  .flat()
	  .map(i => game.cpu[i].id);
    const cpuMeldIds = new Set(cpuMeldCardIds);
    
    const sortedCpuFinal = sortHandWithMeldsFirstv2(game.cpu, evalCpu.melds);
*/
      //

      
    let winner = "tie";
    if (cDW < pDW) winner = "cpu";
    else if (cDW > pDW) winner = "player";

    const scored = applyScoring({
      winner,
      type: "knock",
      pDW,
	cDW,
	who: "cpu"
    });

    let msg;
    if (cDW < pDW) {
      msg = "CPU knocked and wins.\nCPU: " + cDW + " | You: " + pDW;
    } else if (cDW > pDW) {
      msg = "CPU knocked but you have less deadwood!\nCPU: " + cDW + " | You: " + pDW;
    } else {
      msg = "CPU knocked. Deadwood tie.\nCPU: " + cDW + " | You: " + pDW;
    }
    log(msg);

    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
    setMsg("CPU knocked. Click New Hand to play again.");
    render();
  } //cpuKnock

    
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

updateScoreboard();
render();

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
  const ml = document.getElementById("star-midleft");

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
  ml.style.left = (w * margin) + "px";
  ml.style.top  = (h * 0.5) + "px";
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

//__ layoutButton
function layoutButton() {
    const btn = document.getElementById("btn-new");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5% .. take into account button size
    
    const bw = btn.offsetWidth;
     const bh = btn.offsetHeight;

    //  title.style.position = "absolute";
    btn.style.left = (w * (1 - margin) - bw) + "px";
    btn.style.top = (h * 0.5 - bh / 2) + "px";
    
}//layoutButton

window.addEventListener("load", layoutButton);
window.addEventListener("resize", layoutButton);

// knock
//__ layoutButton
function layoutButtonKnock() {
    const btn = document.getElementById("btn-knock");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5% .. take into account button size
    const bw = btn.offsetWidth;
     const bh = btn.offsetHeight;
    const extraOffset = 20;

    //  title.style.position = "absolute";
    btn.style.left = (w * (1 - margin) - bw - extraOffset) + "px";
    btn.style.top = (h * 0.5 - bh / 2) + "px";
    
}//layoutButton

window.addEventListener("load", layoutButtonKnock);
window.addEventListener("resize", layoutButtonKnock);

//gin
//__ layoutButtonGin
function layoutButtonGin() {
    const btn = document.getElementById("btn-gin");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 0.05; // 0.05 is 5% .. take into account button size
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const extraOffset = 20;

    //  title.style.position = "absolute";
    btn.style.left = (w * (1 - margin) - bw - extraOffset) + "px";
    btn.style.top = (h * 0.5 - bh / 2) + "px";
    
}//layoutButtonGin

window.addEventListener("load", layoutButtonGin);
window.addEventListener("resize", layoutButtonGin);


//window.allResultsPlayer = [];
// Click on scoreboard
document.querySelector(".scoreboard").addEventListener("click", () => {
  scoreBoardDetails(); 
});

document.getElementById("title").addEventListener("click", () => {
//    window.open("gameRules.pdf", "_blank");
    document.getElementById("title").addEventListener("click", () => {
	const extra = document.getElementById("modal-extra");
	extra.innerHTML = `
        <iframe src="gameRules.pdf" style="width:100%; height:70vh; border:none;"></iframe>
    `;
	showMessage("Game Rules");
    });
    
});
