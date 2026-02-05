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
    //      console.log("-- evaluate -- ");
    //      console.log(  "\nHand: ", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
    console.log("\n" +  
		`Hand: ${hand.map((c,i) => `${i}) ${c.rank}${c.suit}`).join("  ")}`  );
    console.log("\n" +  
		`Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );

console.log("In Evaluate: VALUES:", hand.map(c => `${c.rank}:${c.runValue}`).join("  "));

//          const melds = getAllMelds(hand);
const melds = getAllMeldsv2(hand);
console.log("In evaluate v2 ... MELDS:", JSON.stringify(melds));

const testResult = getAllMeldsv3(hand);

console.log("In evaluate v3 ... MELDS:", JSON.stringify(testResult));

// debug only
if (JSON.stringify(melds) != JSON.stringify(testResult)){
    showMessage("oops! v2 v3 mismatch"+JSON.stringify(melds)+
		"\n"+JSON.stringify(testResult));
}

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

    //    console.log("=> MeldCardIds:", JSON.stringify(ids));
//    console.log("=> MeldCardIds:", Array.from(ids));

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
        console.log("eliminateDeadCards:" +  
		`Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );

    console.log("VALUES:", hand.map(c => `${c.rank}:${c.runValue} (${typeof c.runValue})`).join("  "));
    console.log("VALUES dead:", hand.map(c => `${c.rank}:${c.deadwoodValue} (${typeof c.deadwoodValue})`).join("  "));

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


//------------------------------------------------------------
// 2. PATTERN DEFINITIONS + REQUIRED CARD COUNTS
//------------------------------------------------------------

const patterns = {
  P1:  ["R3"],             // 3
  P2:  ["R4"],             // 4
  P3:  ["R5"],             // 5
  P4:  ["R6"],             // 6
  P5:  ["R7"],             // 7
  P6:  ["R8"],             // 8
  P7:  ["R9"],             // 9
  P8:  ["R10"],            // 10

  P9:  ["S3"],             // 3
  P10: ["S4"],             // 4

  P11: ["R3","R3"],        // 6
  P12: ["R3","R4"],        // 7
  P13: ["R3","R5"],        // 8
  P14: ["R3","R6"],        // 9
  P15: ["R3","R7"],        // 10
  P16: ["R4","R4"],        // 8
  P17: ["R4","R5"],        // 9
  P18: ["R4","R6"],        // 10
  P19: ["R5","R5"],        // 10
//  P20: ["R5","R6"],        // 11 (never feasible)

  P21: ["S3","S3"],        // 6
  P22: ["S3","S4"],        // 7
  P23: ["S4","S4"],        // 8

  P24: ["S3","R3"],        // 6
  P25: ["S3","R4"],        // 7
  P26: ["S3","R5"],        // 8
  P27: ["S3","R6"],        // 9
  P28: ["S3","R7"],        // 10
  P29: ["S4","R3"],        // 7
  P30: ["S4","R4"],        // 8
  P31: ["S4","R5"],        // 9
  P32: ["S4","R6"],        // 10

  P33: ["R3","R3","R3"],   // 9
  P34: ["R3","R3","R4"],   // 10

  P35: ["S3","S3","S3"],   // 9
  P36: ["S3","S3","S4"],   // 10

  P37: ["S3","R3","R3"],   // 9
  P38: ["S3","R3","R4"],   // 10
  P39: ["S4","R3","R3"],   // 10

  P40: ["S3","S3","R3"],   // 9
  P41: ["S3","S3","R4"],   // 10
  P42: ["S3","S4","R3"]    // 10
};

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

/*
function buildMeldsForPattern(pattern, live) {
  const melds = [];
  const usedIds = new Set();   // ⭐ track by ID, not object reference

  // ------------------------------------------------------------
  // Helper: find a run of size k
  // ------------------------------------------------------------
  function findRun(k) {
    const suits = ["♣","♦","♥","♠"];

    for (const s of suits) {
      // Collect runValues for this suit
      const ranks = live
        .filter(c => c.suit === s)
        .map(c => c.runValue)
        .sort((a,b) => a - b);

      // Scan for sequences
      for (let i = 0; i < ranks.length; i++) {
        let seq = [ranks[i]];

        for (let j = i + 1; j < ranks.length; j++) {
          if (ranks[j] === seq[seq.length - 1] + 1) {
            seq.push(ranks[j]);
          } else if (ranks[j] > seq[seq.length - 1] + 1) {
            break;
          }
        }

        if (seq.length >= k) {
          // Convert runValues → actual card objects
          const cards = seq.slice(0, k).map(v =>
            live.find(c =>
              c.suit === s &&
              c.runValue === v &&
              !usedIds.has(c.id)
            )
          );

          if (cards.every(Boolean)) {
            return cards;
          }
        }
      }
    }

    return null;
  }

  // ------------------------------------------------------------
  // Helper: find a set of size k
  // ------------------------------------------------------------
  function findSet(k) {
    const groups = {};

    for (const c of live) {
      if (!usedIds.has(c.id)) {
        groups[c.rank] = groups[c.rank] || [];
        groups[c.rank].push(c);
      }
    }

    for (const r in groups) {
      if (groups[r].length >= k) {
        return groups[r].slice(0, k);
      }
    }

    return null;
  }

  // ------------------------------------------------------------
  // Build melds for each pattern element
  // ------------------------------------------------------------
  for (const m of pattern) {
    const type = m[0];
    const size = parseInt(m.slice(1), 10);

    let meld =
      type === "R"
        ? findRun(size)
        : findSet(size);

    if (!meld) return null;

    meld.forEach(c => usedIds.add(c.id));
    melds.push(meld);
  }

  return melds;
} //buildMeldsForPattern
*/


//------------------------------------------------------------
// 5. MAIN SOLVER
//------------------------------------------------------------

function getAllMeldsv3(hand) {

    console.log("getAllMeldsv3:" +  
		`Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );
    console.log("with VALUES:", hand.map(c => `${c.rank}:${c.runValue}`).join("  "));

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
    
    console.log(  "Live (",M,"): ", live.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
    
    console.log("VALUES:",  live.map(c => `${c.rank}:${c.runValue}`).join(" "));
    
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
    if (!melds) continue;

    const used = new Set(melds.flat());
    const dw = hand.filter(c => !used.has(c));

//      console.log("used: ", used);
//      console.log("dw: ", dw);
      
      // fix but now worse
      //      const usedIds = new Set(melds.flat().map(c => c.id));
//      const dw = hand.filter(c => !usedIds.has(c.id));

    if (!best || dw.length < best.deadwood.length) {
      best = { pattern: id, melds, deadwood: dw };
    }
  }

  return best;
}
