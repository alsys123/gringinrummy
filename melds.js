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

// ENTRY POINT
//__ evaluate
function evaluate(hand) {

    
    const melds = getAllMeldsv3(hand);

//    consoleLogHand(hand,melds);

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
    } //dfs

    dfs(0, new Set(), []);

    // otherwise count them all
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
//    console.log("\nIn meldCardIds");
//      console.log("hand:", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join("  "));
//      console.log(
//	  `evalCpu = { deadwood:${evalInfo.deadwood}, melds:${evalInfo.melds
//    .map(m => `[${m.join(",")}]`)
//    .join(" ")} }`
//      );
      
    const ids = new Set();
    for (const meld of evalInfo.melds) {
	for (const idx of meld) {
            ids.add(hand[idx].id);
	    //	  ids.add(idx);
	    
	}
    }

//    console.log("=> MeldCardIds string:", JSON.stringify(ids));
//    console.log("=> MeldCardIds array:", Array.from(ids));

    return ids;
  } //meldCardIds


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
function sortHandWithMeldsFirstv2(hand, pattern) {
  const suitOrder = {"♣":0,"♦":1,"♥":2,"♠":3};

  // Build meld ID list in EXACT pattern order
  const meldCardIds = pattern.flat().map(i => hand[i].id);

  // Map card.id → its position in the meld sequence
  const meldPos = new Map();
  meldCardIds.forEach((id, idx) => meldPos.set(id, idx));

  return [...hand].sort((a, b) => {
    const aIn = meldPos.has(a.id);
    const bIn = meldPos.has(b.id);

    // Melds first
    if (aIn && !bIn) return -1;
    if (!aIn && bIn) return 1;

    // Both meld cards → sort by meld pattern order
    if (aIn && bIn) {
      return meldPos.get(a.id) - meldPos.get(b.id);
    }

    // Both deadwood → normal sort
    if (a.rank === b.rank) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.rank - b.rank;
  });
}
/*
//feb 9
function sortHandWithMeldsFirstv2(hand, pattern) {
  const suitOrder = {"♣":0,"♦":1,"♥":2,"♠":3};

//    return(hand);
    
  // Build meld ID list from pattern
  const meldCardIds = pattern.flat().map(i => hand[i].id);
  const meldSet = new Set(meldCardIds);

  return [...hand].sort((a, b) => {
    const aM = meldSet.has(a.id);
    const bM = meldSet.has(b.id);

    // Melds first
    if (aM && !bM) return -1;
    if (!aM && bM) return 1;

    // Inside melds or inside deadwood → normal sort
    if (a.rank === b.rank) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.rank - b.rank;
  });
}
*/
// new one Feb 8
function sortHandWithMeldsFirst(hand) {
  const order = {"♣":0,"♦":1,"♥":2,"♠":3};

  const sets = findSets(hand).flat();   // flatten in case they return arrays
  const runs = findRuns(hand).flat();

  const meldIDs = new Set([...sets, ...runs].map(c => c.id));

  function rankValue(r) {
    if (typeof r === "number") return r;
    if (r === "A") return 1;
    if (["J","Q","K"].includes(r)) return 10;
    return Number(r);
  }

  return [...hand].sort((a, b) => {
    const aM = meldIDs.has(a.id);
    const bM = meldIDs.has(b.id);

    if (aM !== bM) return aM ? -1 : 1;

    const ar = rankValue(a.rank);
    const br = rankValue(b.rank);

    if (ar !== br) return ar - br;

    return order[a.suit] - order[b.suit];
  });
  }
  
/*
function sortHandWithMeldsFirst(hand) {
//    console.log("In sortHandWithMeldsFirst: ", hand);

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

*/

/*

  Version 2 of finding Melds
  
*/

function getAllMeldsv2(hand) {
  const { sets, remaining } = findSetsv2(hand);
  const runs = findRunsv2(hand, remaining);

  return [...sets, ...runs];
} //getAllMeldsv2


function findSetsv2(hand) {
  const sets = [];
  const byRank = {};

  // group by rank
  hand.forEach((card, i) => {
    if (!byRank[card.rank]) byRank[card.rank] = [];
    byRank[card.rank].push(i);
  });

  const used = new Set();

  for (const rank in byRank) {
    const idxs = byRank[rank];

    if (idxs.length >= 3) {
      // record the set
      sets.push(idxs.slice());

      // mark these cards as used
      idxs.forEach(i => used.add(i));
    }
  }

  // build remaining card indices
  const remaining = [];
  for (let i = 0; i < hand.length; i++) {
    if (!used.has(i)) remaining.push(i);
  }

  return { sets, remaining };
} //findSetsv2

//__ findRunsv2
function findRunsv2(hand, remainingIdxs) {
  const runs = [];
  const bySuit = {};

//    console.log("RUN GROUP:", suit, arr.map(x => `${x.value}:${hand[x.i].rank}${hand[x.i].suit}`).join(" "));

    // group remaining cards by suit
    // changed .value to .runVALUE 
  remainingIdxs.forEach(i => {
    const card = hand[i];
//      const value = Number(card.value);   // <-- force numeric
      const value = Number(card.runValue ?? card.rank);
    if (!bySuit[card.suit]) bySuit[card.suit] = [];
    bySuit[card.suit].push({ i, runValue });
  });

  // scan each suit for consecutive sequences
  for (const suit in bySuit) {
    const arr = bySuit[suit].sort((a, b) => a.runValue - b.runValue);

    if (arr.length < 3) continue;

    let run = [arr[0]];

    for (let k = 1; k < arr.length; k++) {
      const prev = arr[k - 1].runValue;
      const curr = arr[k].runValue;

      if (curr === prev + 1) {
        run.push(arr[k]);
      } else {
        if (run.length >= 3) {
          runs.push(run.map(x => x.i));
        }
        run = [arr[k]];
      }
    }

    if (run.length >= 3) {
      runs.push(run.map(x => x.i));
    }
  }

//    console.log("my hand:", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join("  "));
//    console.log("Remaining IDXs:", JSON.stringify(remainingIdxs));
//    console.log("Return Runs:", JSON.stringify(runs));

  return runs;
} //findRunsv2


/*

  GENERATING BEST MELD COBMO TO MAXIMIZE DEADWOOD
  
  */

function bestMeldCombo(hand) {
  const allMelds = getAllMeldsv2(hand);
  const combos = generateMeldCombos(allMelds);

  let best = null;

  for (const combo of combos) {
    const deadwood = computeDeadwood(hand, combo);

    if (!best || deadwood < best.deadwood) {
      best = { melds: combo, deadwood };
    }
  }

  return best || { melds: [], deadwood: computeDeadwood(hand, []) };
} // bestMeldCombo


function computeDeadwood(hand, melds) {
  const used = new Set();
  melds.forEach(m => m.forEach(i => used.add(i)));

  let total = 0;
  for (let i = 0; i < hand.length; i++) {
    if (!used.has(i)) {
      total += cardDeadwoodValue(hand[i]);
    }
  }
  return total;
} // computeDeadwood


function generateMeldCombos(allMelds) {
  const results = [];

  function dfs(index, current, used) {
    if (index === allMelds.length) {
      results.push(current.slice());
      return;
    }

    // Option 1: skip this meld
    dfs(index + 1, current, used);

    // Option 2: take this meld if no overlap
    const meld = allMelds[index];
    if (meld.every(i => !used.has(i))) {
      meld.forEach(i => used.add(i));
      current.push(meld);
      dfs(index + 1, current, used);
      current.pop();
      meld.forEach(i => used.delete(i));
    }
  }

  dfs(0, [], new Set());
  return results;
} // generateMeldCombos

function cardDeadwoodValue(card) {
  if (card.rank === "A") return 1;
  if (["J","Q","K"].includes(card.rank)) return 10;
  return Number(card.rank);
} //cardDeadwoodValue



//------------------------------------------------------------
// V3 of melds
//------------------------------------------------------------

//------------------------------------------------------------
// 1. DEAD CARD ELIMINATION
//------------------------------------------------------------

function eliminateDeadCards(hand) {
//        console.log("eliminateDeadCards:" +  
//		`Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );
//
//    console.log("VALUES:", hand.map(c => `${c.rank}:${c.runValue} (${typeof c.runValue})`).join("  "));
//    console.log("VALUES dead:", hand.map(c => `${c.rank}:${c.deadwoodValue} (${typeof c.deadwoodValue})`).join("  "));

  const rankCounts = {};
  const suitRanks = { "♣": [], "♦": [], "♥": [], "♠": [] };

    // Build rank counts and suit→rank lists
    // change .value to .runValue
  for (const card of hand) {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    suitRanks[card.suit].push(card.runValue);
  }

  // Sort suit ranks
  for (const s in suitRanks) {
    suitRanks[s].sort((a,b)=>a-b);
  }

  // Helper: does this card have adjacency in its suit?
  function hasRunNeighbor(card) {
    const ranks = suitRanks[card.suit];
    const v = card.runValue;
    return ranks.includes(v-1) || ranks.includes(v+1);
  }

  const live = [];
  const dead = [];

  for (const card of hand) {
    const canSet = rankCounts[card.rank] >= 3;
    const canRun = hasRunNeighbor(card);

    if (canSet || canRun) live.push(card);
    else dead.push(card);
  }

  return { live, dead };
} // eliminateDeadCards


// Compute required meld cards
// eventually get rid of this and put the total in the data structure
function requiredCards(pattern) { 
  return pattern.reduce((sum, m) => sum + parseInt(m.slice(1)), 0);
  }


/*
//with debug got back to old later
function requiredCards(pattern) {
    console.log( "\n");
  return pattern.reduce((sum, m) => {
    const val = parseInt(m.slice(1));
    console.log(`Adding ${val} from ${m} → running total = ${sum + val}`);
    return sum + val;
  }, 0);
}
*/

//------------------------------------------------------------
// 3. FEASIBILITY CHECKS (RUNS + SETS)
//------------------------------------------------------------

// change .value to .runValue
function computeStats(live) {
  const rankCounts = {};
  const suitRanks = { "♣": [], "♦": [], "♥": [], "♠": [] };

  for (const c of live) {
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
    suitRanks[c.suit].push(c.runValue);
  }

  for (const s in suitRanks) suitRanks[s].sort((a,b)=>a-b);
/*
  function longestRun(arr) {
    if (arr.length === 0) return 0;
    let max = 1, cur = 1;
    for (let i=1;i<arr.length;i++) {
      if (arr[i] === arr[i-1]) continue;
      if (arr[i] === arr[i-1] + 1) {
        cur++;
        max = Math.max(max, cur);
      } else cur = 1;
    }
    return max;
  }
*/
    function longestRun(arr) {

//	console.log(" longestRun input:", arr.join(" "));

	if (arr.length === 0) return 0;

  let max = 1;
  let cur = 1;

  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1];
    const curr = arr[i];

    if (curr === prev) {
      // duplicate rank in same suit: ignore, don't reset
      continue;
    }

    if (curr === prev + 1) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 1;
    }
  }

  return max;
}

  const runLengths = Object.values(suitRanks).map(longestRun).sort((a,b)=>b-a);
  const maxRun = runLengths[0] || 0;
  const secondRun = runLengths[1] || 0;

  let ranks3 = 0, ranks4 = 0;
  for (const c of Object.values(rankCounts)) {
    if (c >= 3) ranks3++;
    if (c >= 4) ranks4++;
  }

  return { maxRun, secondRun, ranks3, ranks4 };
} //longestRun

function feasible(pattern, stats) {
  for (const m of pattern) {
    const type = m[0];
    const size = parseInt(m.slice(1));

    if (type === "R") {
      if (stats.maxRun < size) return false;
    } else {
      if (size === 3 && stats.ranks3 < 1) return false;
      if (size === 4 && stats.ranks4 < 1) return false;
    }
  }
  return true;
} //feasible


//------------------------------------------------------------
// 4. CONSTRUCT MELDS FOR A GIVEN PATTERN
//------------------------------------------------------------

function buildMeldsForPattern(pattern, live) {

// debug only
//    if (JSON.stringify(pattern) === JSON.stringify(["R3","R4"])) {
//	
//	console.log("buildMeldsForPattern: ",JSON.stringify(pattern),
//		    "Live (",live.length,"): ",
//		    live.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
//    }

  const melds = [];
  const used = new Set();

    // change .value to .runValue
  // Helper: find a run of size k
  function findRun(k) {
    const suits = ["♣","♦","♥","♠"];
    for (const s of suits) {
      const ranks = live.filter(c => c.suit === s).map(c => c.runValue).sort((a,b)=>a-b);
      for (let i=0;i<ranks.length;i++) {
        let seq = [ranks[i]];
        for (let j=i+1;j<ranks.length;j++) {
          if (ranks[j] === seq[seq.length-1] + 1) seq.push(ranks[j]);
          else if (ranks[j] > seq[seq.length-1] + 1) break;
        }
        if (seq.length >= k) {
          const cards = seq.slice(0,k).map(v => live.find(c => c.suit===s && c.runValue===v && !used.has(c)));
          if (cards.every(Boolean)) return cards;
        }
      }
    }
    return null;
  }

  // Helper: find a set of size k
  function findSet(k) {
    const ranks = {};
    for (const c of live) {
      if (!used.has(c)) {
        ranks[c.rank] = ranks[c.rank] || [];
        ranks[c.rank].push(c);
      }
    }
    for (const r in ranks) {
      if (ranks[r].length >= k) return ranks[r].slice(0,k);
    }
    return null;
  }

  for (const m of pattern) {
    const type = m[0];
    const size = parseInt(m.slice(1));
    let meld;

    if (type === "R") meld = findRun(size);
    else meld = findSet(size);

    if (!meld) return null;

    meld.forEach(c => used.add(c));
    melds.push(meld);
  }

  return melds;
}



//------------------------------------------------------------
// 5. MAIN SOLVER
//------------------------------------------------------------

function getAllMeldsv3(hand) {

//    console.log("getAllMeldsv3:" +  
//		`Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );
//    console.log("with VALUES:", hand.map(c => `${c.rank}:${c.runValue}`).join("  "));

    const result = solveHand(hand);
    if (!result || !result.melds) {
	return [];
    }
    const full = meldsToIndexes(result.melds, hand);
    // If no pattern produced valid melds, return empty array (old behavior)
    if (!full) {
	return [];
    }
    return full;
}

function meldsToIndexes(melds, hand) {
  return melds.map(meld =>
    meld.map(card => hand.indexOf(card))
  );
}


function solveHand(hand) {
  const { live, dead } = eliminateDeadCards(hand);
  const M = live.length;
  const stats = computeStats(live);


    //Usefull: test log
    console.log( "---" );
    console.log(  "Hand: ", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));  
    console.log(  "Live (",M,"): ", live.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));        console.log("VALUES:",  live.map(c => `${c.rank}:${c.runValue}`).join(" "));
    console.log(  "Dead:",   dead.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
    console.log( `Stats: maxRun=${stats.maxRun}, secondRun=${stats.secondRun}, ranks3=${stats.ranks3}, ranks4=${stats.ranks4}`
	       );
    
    // Step 2: filter patterns by card count + feasibility
  const feasiblePatterns = Object.entries(patterns)
    .filter(([id, pat]) => requiredCards(pat) <= M)
    .filter(([id, pat]) => feasible(pat, stats));

    console.log( "Feasible Patterns: ",
		 feasiblePatterns.map(([id, pat]) => `${id}: ${pat.join(",")}`).join("  &  ") );   
  // Step 3a: only one pattern → return immediately
  if (feasiblePatterns.length === 1) {
    const [id, pat] = feasiblePatterns[0];
    const melds = buildMeldsForPattern(pat, live);
    return { pattern: id, melds, deadwood: dead };
  }

  // Step 3b: multiple patterns → test each
  let best = null;

  for (const [id, pat] of feasiblePatterns) {
      const melds = buildMeldsForPattern(pat, live);

      consoleLogHand(live,melds);

      if (!melds) {

	  console.log("No melds for pattern: ", id, JSON.stringify(pat));

	  continue;
      };

    const used = new Set(melds.flat());
    const dw = hand.filter(c => !used.has(c));

      
      console.log("Pattern: ", id, JSON.stringify(pat));    
      console.log("used and dw:");
      logPrintSet(used);
      console.log("*** These are deadwoods: "), logPrintCards(dw);

      /*
      // fix but now worse
      //      const usedIds = new Set(melds.flat().map(c => c.id));
//      const dw = hand.filter(c => !usedIds.has(c.id));
      if (best) {
      console.log("Testing the best: dw.length < best.deadwood.length",
		  JSON.stringify(dw.length),
		  JSON.stringify(best.deadwood.length));
      } else {
	  console.log("Testing the (not best yet) best: dw.length:",
		      JSON.stringify(dw.length));
      } // debug if
*/

	logBest("in loop:", best);

    if (!best || dw.length < best.deadwood.length) {
	best = { pattern: id, melds, deadwood: dw };

	console.log("dw lenght:",dw.length, ". best length: ",best.deadwood.length);
	logBest("** in if - ", best);
	
    }
      
  } // for

	logBest("FINAL:", best);
    
  return best;
}

//__ sortHandUsingPattern
function sortHandUsingPattern(hand, pattern) {
  // Flatten meld indices in order
  const meldOrder = pattern.flat();

  // Map card.id → its meld position (0,1,2,...)
  const meldPos = new Map();
  meldOrder.forEach((idx, pos) => {
    meldPos.set(hand[idx].id, pos);
  });

  return [...hand].sort((a, b) => {
    const aIn = meldPos.has(a.id);
    const bIn = meldPos.has(b.id);

    // Meld cards first
    if (aIn && !bIn) return -1;
    if (!aIn && bIn) return 1;

    // If both are meld cards, sort by their meld position
    if (aIn && bIn) {
      return meldPos.get(a.id) - meldPos.get(b.id);
    }

    // Both are deadwood → normal sort
    if (a.rank === b.rank) {
      const order = {"♣":0,"♦":1,"♥":2,"♠":3};
      return order[a.suit] - order[b.suit];
    }
    return a.rank - b.rank;
  });
} //sortHandUsingPattern

//__sortHandUsingMeldIds
function sortHandUsingMeldIds(hand, meldCardIds) {
  // Map card.id → its meld position
  const meldPos = new Map();
  meldCardIds.forEach((id, pos) => meldPos.set(id, pos));

  const suitOrder = {"♣":0,"♦":1,"♥":2,"♠":3};

  return [...hand].sort((a, b) => {
    const aIn = meldPos.has(a.id);
    const bIn = meldPos.has(b.id);

    // Meld cards first
    if (aIn && !bIn) return -1;
    if (!aIn && bIn) return 1;

    // Both meld cards → sort by meld order
    if (aIn && bIn) {
      return meldPos.get(a.id) - meldPos.get(b.id);
    }

    // Both deadwood → normal sort
    if (a.rank === b.rank) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.rank - b.rank;
  });
} //sortHandUsingMeldIds
