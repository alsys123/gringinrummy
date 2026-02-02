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

//__ evaluate
  function evaluate(hand) {

//          const melds = getAllMelds(hand);
      const melds = getAllMeldsv2(hand);
//      console.log("MELDS:", JSON.stringify(melds));

      
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



/*

  Version 2 of finding Melds
  
*/

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




function getAllMeldsv2(hand) {
  const { sets, remaining } = findSetsv2(hand);
  const runs = findRunsv2(hand, remaining);

  return [...sets, ...runs];
} //getAllMeldsv2



function findRunsv2(hand, remainingIdxs) {
  const runs = [];
  const bySuit = {};

//    console.log("RUN GROUP:", suit, arr.map(x => `${x.value}:${hand[x.i].rank}${hand[x.i].suit}`).join(" "));

  // group remaining cards by suit
  remainingIdxs.forEach(i => {
    const card = hand[i];
//      const value = Number(card.value);   // <-- force numeric
      const value = Number(card.value ?? card.rank);
    if (!bySuit[card.suit]) bySuit[card.suit] = [];
    bySuit[card.suit].push({ i, value });
  });

  // scan each suit for consecutive sequences
  for (const suit in bySuit) {
    const arr = bySuit[suit].sort((a, b) => a.value - b.value);

    if (arr.length < 3) continue;

    let run = [arr[0]];

    for (let k = 1; k < arr.length; k++) {
      const prev = arr[k - 1].value;
      const curr = arr[k].value;

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
