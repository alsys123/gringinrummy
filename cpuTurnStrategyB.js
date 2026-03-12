/* ------------------------------
   CPU Strategy --- STRATEGY *** B ***
   ------------------------------ */


async function cpuTurnStratB() {

    log("cpuTurn - strategy B","sys");
    if (game.phase === "round-over") return;

    const evalCpu = evaluate(game.cpu);
    const cDW = evalCpu.deadwood;

    // GIN check (always smart)
    if (cDW === 0) {
        cpuGin();
        return;
    }

    //+++TODO+++ check if we can get BIG GIN with picking up the discard
    
    // Knock check (difficulty affects willingness)
    if (cDW <= 10) {
        if (Math.random() < cpuLevel.knockChance) {
            cpuKnock();
            return;
        }
        // otherwise: CPU "hesitates" and keeps playing
    }

    //+++TODO+++
    // Strategy B Algorithm
    //
    //  Score the current hand based on
    //    .. completed melds and size of deadwood
    //
    // pick-up from the discard pile and
    //    discard the first card in cpu hand and re-score the hand.
    //
    // Do this for all 10 cards in the hand - scoring for each hand combination.
    // Based on the highest score we now have the optimum discard if we pick up
    // from the discard pile.  

    // If the improvement from the original score is greater than some
    //    factor then do the move. We are done.
    //
    // Otherwise move onto picking up from stock.

    // Pick from stock.  Evaluate the hand based on discarding
    //   each card in the hand including the card you just picked up.

    // Discard the card that gives up the highest score.

    // Turn is now over.

    // The key here is the scoring!
    // 1) re-evaluate hand with the best melds and deadwood
    // 2) then count
    //
    // sets:
    // 1. if we have a set of 4 =
    // 2. if we have a set of 3 =
    // 3. if we have a set of 2 =
    //
    // runs:
    // 4. run of 9 = 
    // 5. run of 8 = 
    // 6. run of 7 = 
    // 7. run of 6 = 
    // 8. run of 5 = 
    // 9. run of 4 = 
    // 10. run of 3 = 
    // 11. run of 2 =
    //
    // 12. run of 2 (1+1) but there is a gap of =
    // 13. run of 3 (1+2) but there is a gap of =
    // 14. run of 4 (2+2) but there is a gap of =
    
    // NOTE: there may be multiple solution .. pick the best = minimum deadwood
    
    let drawn;
    
    const topDiscard = game.discard[game.discard.length-1];

    // Decide whether to take discard only if it lowers your deadwood
    if (topDiscard) {
        const hypothetical = [...game.cpu, topDiscard];
        const evalWith = evaluate(hypothetical);

        const improvement = evalWith.deadwood + 1 <= cDW;

        if (improvement && Math.random() < cpuLevel.discardTakeChance) {
            drawn = game.discard.pop();
            log("CPU drew " + prettyCard(drawn) + " from discard.","cpu");
            render();
            animateCpuTakeFromDiscard(drawn);
            await sleep(2000); // was 800
        }
    }

    // Otherwise draw stock
    if (!drawn) {
        if (!game.stock.length) {
            stockDepletionResolution();
            return;
        }
        drawn = game.stock.pop();
        log("CPU drew from stock.","cpu");
    }

    game.cpu.push(drawn);

    // Choose discard (difficulty affects mistakes)
    // randonly take v1 or v2
//    const idx = cpuChooseDiscardIndexWithDifficultyV1();
    const idx = getCpuDiscardStratB(drawn);
    
//    const idx = Math.random() < 0.5
//	  ? cpuChooseDiscardIndexWithDifficultyV1()
//	  : cpuChooseDiscardIndex_DifficultV2();
    
    const [d] = game.cpu.splice(idx,1);

    cpuDiscardAnimate(d);
    await sleep(100); // 1000 .. must be the same as AA for smooth placement
    
    game.discard.push(d);

    log("CPU discarded " + prettyCard(d) + ".","cpu");

    game.turn = "player";
    game.phase = "await-draw";
    setMsg("Draw from stock or discard.");

    updateButtons();
    await sleep(300);
    render();
    updateButtons();

    if (autoPlayer) {
	playerTurn();
    }
    
}//cpuTurn strat B

function getCpuDiscardStratB(drew) {
    const hand = game.cpu;
    const sorted = sortHandByRank(hand);
    const evalInfo = evaluate(sorted);
    const meldIds = meldCardIds(sorted, evalInfo);

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i];

        // 🚫 Never discard the card we just drew
        if (c.id === drew.id) continue;

        // 🚫 Never discard a card that is part of a meld
        if (meldIds.has(c.id)) continue;

        const v = cardValue(c.rank);

        // --- Rank potential ---
        let rankPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.rank === c.rank) {
                rankPotential += 6;
            }
        }

        // --- Run potential ---
        let runPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.suit === c.suit) {
                const diff = Math.abs(other.rank - c.rank);
                if (diff === 1) runPotential += 5;
                if (diff === 2) runPotential += 2;
            }
        }

        // --- High card penalty only if useless ---
        const highPenalty =
            (c.rank >= 10 && rankPotential === 0 && runPotential === 0)
                ? -2
                : 0;

        // --- Low card penalty ---
        const lowPenalty = (c.rank <= 4 ? -1 : 0);

        // --- Final score ---
        const score =
            v +
            lowPenalty +
            highPenalty +
            rankPotential +
            runPotential;

        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }

    // Difficulty: sometimes make a mistake
    if (Math.random() < cpuLevel.discardMistake) {
        let idx;
        do {
            idx = Math.floor(Math.random() * hand.length);
        } while (
            hand[idx].id === drew.id ||     // don't discard drawn card
            meldIds.has(hand[idx].id)       // don't discard meld card
        );
        return idx;
    }

    const targetId = sorted[bestIndex].id;
    const realIndex = hand.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
}

/*
function getCpuDiscardStratB(drew) {
    const hand = game.cpu;
    const sorted = sortHandByRank(hand);
    const evalInfo = evaluate(sorted);
    const meldIds = meldCardIds(sorted, evalInfo);

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i];

        // 🚫 Do NOT discard the card we just drew
        if (c.id === drew.id) {
            continue;
        }

        const v = cardValue(c.rank);
        const isMeld = meldIds.has(c.id);

        // --- Rank potential ---
        let rankPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.rank === c.rank) {
                rankPotential += 6;
            }
        }

        // --- Run potential ---
        let runPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.suit === c.suit) {
                const diff = Math.abs(other.rank - c.rank);
                if (diff === 1) runPotential += 5;
                if (diff === 2) runPotential += 2;
            }
        }

        // --- High card penalty only if useless ---
        const highPenalty =
            (c.rank >= 10 && rankPotential === 0 && runPotential === 0)
                ? -2
                : 0;

        // --- Original penalties ---
        const meldPenalty = isMeld ? -12 : 0;
        const lowPenalty = (c.rank <= 4 ? -1 : 0);

        // --- Final score ---
        const score =
            v +
            meldPenalty +
            lowPenalty +
            highPenalty +
            rankPotential +
            runPotential;

        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }

    // Difficulty: sometimes make a mistake
    if (Math.random() < cpuLevel.discardMistake) {
        // But still don't discard the drawn card
        let idx;
        do {
            idx = Math.floor(Math.random() * hand.length);
        } while (hand[idx].id === drew.id);
        return idx;
    }

    const targetId = sorted[bestIndex].id;
    const realIndex = hand.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
}//getCpuDiscardStratB
*/

/*
function getCpuDiscardStratB() {
    const hand = game.cpu;
    const sorted = sortHandByRank(hand);
    const evalInfo = evaluate(sorted);
    const meldIds = meldCardIds(sorted, evalInfo);

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i];
        const v = cardValue(c.rank);
        const isMeld = meldIds.has(c.id);

        // --- NEW: Evaluate potential melds (rank-based) ---
        let rankPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.rank === c.rank) {
                rankPotential += 6; // strong incentive to keep same-rank cards
            }
        }

        // --- NEW: Evaluate potential runs (suit-based) ---
        let runPotential = 0;
        for (const other of sorted) {
            if (other !== c && other.suit === c.suit) {
                const diff = Math.abs(other.rank - c.rank);
                if (diff === 1) runPotential += 5; // adjacent = strong
                if (diff === 2) runPotential += 2; // near-adjacent = mild
            }
        }

        // --- NEW: High cards are NOT automatically bad ---
        // Only penalize high cards if they have NO potential
        const highPenalty =
            (c.rank >= 10 && rankPotential === 0 && runPotential === 0)
                ? -2
                : 0;

        // --- Original penalties ---
        const meldPenalty = isMeld ? -12 : 0; // stronger: don't break melds
        const lowPenalty = (c.rank <= 4 ? -1 : 0);

        // --- Final score ---
        const score =
            v +            // base value
            meldPenalty +
            lowPenalty +
            highPenalty +
            rankPotential +
            runPotential;

        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }

    // Difficulty: sometimes make a mistake
    if (Math.random() < cpuLevel.discardMistake) {
        return Math.floor(Math.random() * hand.length);
    }

    const targetId = sorted[bestIndex].id;
    const realIndex = hand.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
}//discard Strat B
*/


