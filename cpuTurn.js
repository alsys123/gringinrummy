/* ------------------------------
   CPU Strategy
   ------------------------------ */

function cpuTurn() {
    cpuTurnStratA();
}


// ********* Strategy A ***********

async function cpuTurnStratA() {

    log("cpuTurn - strategy A","sys");
    if (game.phase === "round-over") return;

    const evalCpu = evaluate(game.cpu);
    const cDW = evalCpu.deadwood;

    // GIN check (always smart)
    if (cDW === 0) {
        cpuGin();
        return;
    }

    // Knock check (difficulty affects willingness)
    if (cDW <= 7) {
        if (Math.random() < cpuLevel.knockChance) {
            cpuKnock();
            return;
        }
        // otherwise: CPU "hesitates" and keeps playing
    }

    let drawn;
    const topDiscard = game.discard[game.discard.length-1];

    // Decide whether to take discard
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
    const idx = getCpuDiscardStratA();
    
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
    
}//cpuTurn stratA

function getCpuDiscardStratA() {
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

    // Difficulty: sometimes discard a random card instead
    if (Math.random() < cpuLevel.discardMistake) {
        return Math.floor(Math.random() * hand.length);
    }

    const targetId = sorted[bestIndex].id;
    const realIndex = hand.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
}// discard stratA

// ********* Strategy B ***********

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

    // Knock check (difficulty affects willingness)
    if (cDW <= 7) {
        if (Math.random() < cpuLevel.knockChance) {
            cpuKnock();
            return;
        }
        // otherwise: CPU "hesitates" and keeps playing
    }

    let drawn;
    const topDiscard = game.discard[game.discard.length-1];

    // Decide whether to take discard
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
    const idx = getCpuDiscardStratB();
    
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

