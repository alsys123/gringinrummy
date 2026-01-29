(function() {
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
    drawn: null
  };

  let matchScore = {
    player: 0,
    cpu: 0,
    target: 100
  };

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

    let gBackDoorCode = 0;

  /* ------------------------------
     Utility Functions
  ------------------------------ */

  function createDeck() {
    const d = [];
    for (const s of suits)
      for (const r of ranks)
        d.push({rank:r, suit:s, id:s+r});
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

  function cardFace(c) {
    const div = document.createElement("div");
    div.className = "card player-card";
    div.dataset.id = c.id;

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
     Meld / Deadwood Evaluation
  ------------------------------ */
    
    //__ sortHandByRank
    function sortHandByRank(hand) {
	return [...hand].sort((a,b) => {
	    if (a.rank === b.rank) {
		const order = {"♣":0,"♦":1,"♥":2,"♠":3};
		return order[a.suit] - order[b.suit];
	    }
	    return a.rank - b.rank;
	});
    } // sortHandByRank
    
    function isSet(cards) {
    if (cards.length < 3) return false;
    const r = cards[0].rank;
    return cards.every(c => c.rank === r);
  }

  function isRun(cards) {
    if (cards.length < 3) return false;
    const s = cards[0].suit;
    if (!cards.every(c => c.suit === s)) return false;
    const sorted = [...cards].sort((a,b)=>a.rank-b.rank);
    for (let i=1;i<sorted.length;i++) {
      if (sorted[i].rank !== sorted[i-1].rank + 1) return false;
    }
    return true;
  }

  function getAllMelds(hand) {
    const melds = [];
    const n = hand.length;

    function backtrack(start, idxs) {
      if (idxs.length >= 3) {
        const cards = idxs.map(i => hand[i]);
        if (isSet(cards) || isRun(cards)) {
          melds.push(idxs.slice());
        }
      }
      for (let i=start;i<n;i++) {
        idxs.push(i);
        backtrack(i+1, idxs);
        idxs.pop();
      }
    }
    backtrack(0, []);
    return melds;
  }

  function evaluate(hand) {
    const melds = getAllMelds(hand);
    let bestDW = Infinity;
    let bestPattern = [];

    function dfs(meldIndex, used, chosen) {
      if (meldIndex === melds.length) {
        let dw = 0;
        for (let i=0;i<hand.length;i++) {
          if (!used.has(i)) dw += cardValue(hand[i].rank);
        }
        if (dw < bestDW) {
          bestDW = dw;
          bestPattern = chosen.map(m => m.slice());
        }
        return;
      }

      dfs(meldIndex+1, used, chosen);

      const meld = melds[meldIndex];
      let can = true;
      for (const idx of meld) {
        if (used.has(idx)) { can=false; break; }
      }
      if (can) {
        const used2 = new Set(used);
        meld.forEach(i => used2.add(i));
        chosen.push(meld);
        dfs(meldIndex+1, used2, chosen);
        chosen.pop();
      }
    }

    dfs(0, new Set(), []);

    if (bestDW === Infinity) {
      let dw = 0;
      for (const c of hand) dw += cardValue(c.rank);
      bestDW = dw;
      bestPattern = [];
    }

//      console.log("Evaluate: best Deadwood = ", bestDW, "  Best Melds = ", bestPattern);
      
    return {deadwood: bestDW, melds: bestPattern};
  }

    //_ meldCardIds
  function meldCardIds(hand, evalInfo) {
    const ids = new Set();
    for (const meld of evalInfo.melds) {
      for (const idx of meld) {
        ids.add(hand[idx].id);
      }
    }
    return ids;
  } //meldCardIds

  /* ------------------------------
     Scoring + Tally
  ------------------------------ */

  function applyScoring(result) {
    if (result.winner === "tie") {
      result.points = 0;
      updateScoreboard();
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

    result.points = points;
    return result;
  }

  function showHandTally(result) {
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

  }

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

    //__ render
  function render() {

      el.cpu.innerHTML = "";
      
      // these are the CPU cards
	for (let i = 0; i < game.cpu.length; i++) {
	const b = document.createElement("div");
	b.className = "card back";
	const count = game.cpu.length;
	  
	// tighter fan: smaller angle spread
	// was 4–5°, now tighter
	  const angle = (i - (count - 1) / 2) * 2.5;
	  
	  // smaller cards: reduce width/height in CSS (below)
	  // shift fan to the right
	  const baseOffset = 700;  // shift entire fan right
	  const overlap = 6;      // tighter overlap
	  
	  const x = baseOffset + i * overlap;
	  
	  b.style.position = "absolute";
	  b.style.left = x + "px";
	  b.style.top = "0px";
	  b.style.transform = `rotate(${angle}deg)`;
	  
	  el.cpu.appendChild(b);
      }

      // player cards rendering
      
      el.player.innerHTML = "";
      //      const sorted = sortHandByRank(game.player);
      const sorted = sortHandWithMeldsFirst(game.player);

      // Auto-scale BEFORE positioning cards
      autoScaleHand(el.player, sorted.length, 95, 95);

      const evalPlayer = evaluate(sorted);
      const meldIds = meldCardIds(sorted, evalPlayer);
      
      //    console.log("yes in render");
      //    console.log("game draw = ", game.drawn);
      
      
      let gapInserted = false;
      let i= 0;
      const offset = 0; // move entire hand right
      
      for (const c of sorted) {
	  const isMeld = meldIds.has(c.id);
	  
	  // for scalling the spaces
	  let scale = 1;
	  if (el.player.classList.contains("normal")) scale = 1;
	  if (el.player.classList.contains("small")) scale = 0.8;
	  if (el.player.classList.contains("smaller")) scale = 0.65;
	  if (el.player.classList.contains("tiny")) scale = 0.5;
	  
	  const effectiveSpacing = 95 * scale;
	  
	  
	  // Insert gap before the first non-meld card
	  if (!isMeld && !gapInserted) {
              const gap = document.createElement("div");
              gap.className = "meld-gap";
	      
	      // new gap
	      gap.style.position = "absolute";
//	      gap.style.left = `${offset + i * 75}px`;
	      gap.style.left = `${offset + i * effectiveSpacing}px`;

	      gap.style.top = "400px";
	      //
	
              el.player.appendChild(gap);
	      
	      i++; // gap takes a spot
	      
              gapInserted = true;
	  }
	  
	  const f = cardFace(c);
	  if (isMeld) f.classList.add("meld-card");
	  // REQUIRED — without this, cards do not appear
	  f.style.position = "absolute";
	  
	  //    f.style.left = `${offset + i * 95}px`;
	  f.style.left = `${offset + i * effectiveSpacing}px`;
	  
	  //    f.style.left = `${i * 75}px`;
	  f.style.top = "400px";
	  
	  f.onclick = () => playerDiscard(c.id);
//	  el.player.appendChild(f);
      
	  if (game.drawn === c.id || game.drawn?.id === c.id) {
              f.classList.add("just-drawn");
	      
	  }
	  
	  
	  i++;

	  // open backdoor
	  f.ondblclick = () => openBackDoor();

	  // append ONCE
	  el.player.appendChild(f);

//	  el.player.appendChild(f);

      }
      
      

      // ====== display deadwook count ======
    el.deadwood.textContent = "Deadwood: " + evalPlayer.deadwood;

    el.stockCount.textContent = "(" + game.stock.length + ")";

    if (game.discard.length) {
      const top = game.discard[game.discard.length-1];
      const f = cardFace(top);
      el.discard.innerHTML = "";
      el.discard.className = "card";
      el.discard.appendChild(f);
    } else {
      el.discard.className = "card back";
      el.discard.innerHTML = "<span>EMPTY</span>";
    }

     updateButtons();
  } // render

    //__ updateButtons
    function updateButtons() {
	
//	console.log("updateButtons game.turn = ",game.turn );
	
	const t = game.turn === "player";
	const p = game.phase;
	
	el.btnKnock.disabled = true;
	el.btnGin.disabled   = true;
	
      if (t && p === "await-discard") {

	  const evalPlayer = evaluate(game.player);
	  
//	  console.log("here i am ... with deadwood=", evalPlayer.deadwood);
	  
	  if (evalPlayer.deadwood === 0) el.btnGin.disabled = false;
	  if (evalPlayer.deadwood <= 10) el.btnKnock.disabled = false;

	  // hide
	  document.getElementById("btn-new").style.display = "none";
	  // show it
	document.getElementById("btn-knock").style.display = "";
	document.getElementById("btn-gin").style.display = "";
	  return;
      }

	/// try this one out .. if play and awiting to draw
	if (t && p === "await-draw") {
	    const evalPlayer = evaluate(game.player);
	    
	    //	  console.log("here i am ... with deadwood=", evalPlayer.deadwood);
	    
	    if (evalPlayer.deadwood === 0) el.btnGin.disabled = false;
	    if (evalPlayer.deadwood <= 10) el.btnKnock.disabled = false;
	    
	    // hide
	    document.getElementById("btn-new").style.display = "none";
	    // show it
 	    document.getElementById("btn-knock").style.display = "";
	    document.getElementById("btn-gin").style.display = "";
	    return;
	}

	// show by default
	document.getElementById("btn-new").style.display = "block";
	// hide by default
	document.getElementById("btn-knock").style.display = "none";
	document.getElementById("btn-gin").style.display = "none";

	
  } // updateButtons

    // open a back door to save and restore game states
    function openBackDoor() {
	gBackDoorCode++;
	//	console.log("Back door - double click: ", gBackDoorCode);
	if (gBackDoorCode > 3 ) {
	    document.getElementById("back-door").hidden = false;
	}
	return;
    }

    
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
    game.turn = "player";
    game.phase = "await-draw";
    game.drawn = null;
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

      document.getElementById("btn-new").textContent = "Next Hand";

    log("New hand started.");
    render();
  }

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
      cDW
    });

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

	console.log("I just knocked");

	console.log("game.turn=",game.turn);
	console.log("game.phase=", game.phase);

//	if (game.turn!=="player" || game.phase!=="await-discard") return;
//	if (game.turn!=="player") return;

	console.log("at a");

	const pEval = evaluate(game.player);

	if (pEval.deadwood > 10) {
//      alert("You can only knock with deadwood 10 or less.");
      showMessage("You can only knock with deadwood 10 or less.");
      return;
    }

		console.log("at b");

    const cEval = evaluate(game.cpu);
    const pDW = pEval.deadwood;
    const cDW = cEval.deadwood;

    let winner = "tie";
    if (pDW < cDW) winner = "player";
    else if (pDW > cDW) winner = "cpu";

    const scored = applyScoring({
      winner,
      type: "knock",
      pDW,
      cDW
    });

    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
	setMsg("Hand over. Click New Hand to play again.");

    render();
  } // playerKnock

  function playerGin() {
    if (game.turn!=="player" || game.phase!=="await-discard") return;
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
      cDW
    });

    log("You went Gin.");
    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
      setMsg("You Gin! Click New Hand to play again.");

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
      }
    }
    if (!drawn) {
      if (!game.stock.length) {
        stockDepletionResolution();
        return;
      }
      drawn = game.stock.pop();
      log("CPU drew from stock.");
    }
    game.cpu.push(drawn);

    const idx = cpuChooseDiscardIndex();
    const [d] = game.cpu.splice(idx,1);
    game.discard.push(d);
    log("CPU discarded " + prettyCard(d) + ".");

    game.turn = "player";
    game.phase = "await-draw";
    setMsg("Draw from stock or discard.");
    render();
  }

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
      cDW: 0
    });

    log("CPU went Gin.");
    showHandTally(scored);
    checkMatchEnd();
    game.phase = "round-over";
      setMsg("CPU went Gin. Click New Hand to play again.");

    render();
  }

    //__ cpuKnock
  function cpuKnock() {
    const cEval = evaluate(game.cpu);
    const pEval = evaluate(game.player);
    const cDW = cEval.deadwood;
    const pDW = pEval.deadwood;

    let winner = "tie";
    if (cDW < pDW) winner = "cpu";
    else if (cDW > pDW) winner = "player";

    const scored = applyScoring({
      winner,
      type: "knock",
      pDW,
      cDW
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
    }

//    add the handlers
document.getElementById("stock").onclick = () => {
    if (game.turn === "player") {
	        drawStock();
//	console.log("stock draw");
    }
};

document.getElementById("discard-top").onclick = () => {
    if (game.turn === "player") {
        drawDiscard();
//	console.log("discard draw");
    }
};

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
})();

// this make the function global ...

   function closeModal() {
	console.log("in close");
	document.getElementById("modal").style.display = "none";
    }

// --- new sort by melts first routines

function findSets(hand) {
  const counts = {};
  for (const c of hand) {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
  }

  const setRanks = new Set(
    Object.keys(counts).filter(r => counts[r] >= 3).map(Number)
  );

  return hand.filter(c => setRanks.has(c.rank));
}

function findRuns(hand) {
  const bySuit = { "♣": [], "♦": [], "♥": [], "♠": [] };
  hand.forEach(c => bySuit[c.suit].push(c));

  const runs = new Set();

  for (const suit in bySuit) {
    const cards = bySuit[suit].sort((a,b) => a.rank - b.rank);

    let temp = [cards[0]];
    for (let i = 1; i < cards.length; i++) {
      if (cards[i].rank === cards[i-1].rank + 1) {
        temp.push(cards[i]);
      } else {
        if (temp.length >= 3) temp.forEach(c => runs.add(c.id));
        temp = [cards[i]];
      }
    }
    if (temp.length >= 3) temp.forEach(c => runs.add(c.id));
  }

  return hand.filter(c => runs.has(c.id));
}

function sortHandWithMeldsFirst(hand) {
  const order = {"♣":0,"♦":1,"♥":2,"♠":3};

  const sets = findSets(hand);
  const runs = findRuns(hand);

  // mark all meld cards
  const meldIDs = new Set([...sets, ...runs].map(c => c.id));

  return [...hand].sort((a, b) => {
    const aMeld = meldIDs.has(a.id);
    const bMeld = meldIDs.has(b.id);

    // melds first
    if (aMeld && !bMeld) return -1;
    if (!aMeld && bMeld) return 1;

    // inside melds or inside non-melds → normal sort
    if (a.rank === b.rank) {
      return order[a.suit] - order[b.suit];
    }
    return a.rank - b.rank;
  });
}

