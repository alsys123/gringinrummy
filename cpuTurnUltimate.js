/* ============================================================
   ULTIMATE GIN RUMMY CPU AI (Methodological, Understandable)
   ------------------------------------------------------------
   - Drop-in style, modeled after your Strategy B structure
   - Clear phases:
       1) Gin / Knock decisions
       2) Decide whether to take discard (lookahead)
       3) Draw (discard or stock)
       4) Choose discard via full hand simulation
   - Core ideas:
       - Always evaluate FULL hand (melds + deadwood)
       - Use a consistent scoring function
       - Use simple opponent-safety heuristics
   ============================================================ */

/* -------------
   ENTRY POINT
   ------------- */

async function cpuTurnUltimate() {
    log("cpuTurn - ULTIMATE","sys");
    if (game.phase === "round-over") return;

    // --- 1. Evaluate current CPU hand ---
    const evalCpu = evaluateHand(game.cpu);
    const cDW = evalCpu.deadwood;

    // --- 2. GIN check ---
    if (cDW === 0) {
        cpuGin();
        return;
    }

    // --- 3. BIG GIN check (optional simple version) ---
    // If picking the top discard could give us gin with 11 cards, try it.
    const topDiscard = game.discard[game.discard.length - 1];
    if (topDiscard) {
        const hypothetical = [...game.cpu, topDiscard];
        const evalBig = evaluateHand(hypothetical);
        if (evalBig.deadwood === 0 && hypothetical.length === 11) {
            // Take it and gin immediately
            const drawn = game.discard.pop();
            game.cpu.push(drawn);
            log("CPU drew " + prettyCard(drawn) + " for BIG GIN.","cpu");
            render();
            await sleep(500);
            cpuGin();
            return;
        }
    }

    // --- 4. Knock check (difficulty affects willingness) ---
    if (cDW <= 10) {
        if (Math.random() < cpuLevel.knockChance) {
            cpuKnock();
            return;
        }
        // otherwise: CPU "hesitates" and keeps playing
    }

    // --- 5. Decide whether to take discard (lookahead) ---
    let drawn = null;
    if (topDiscard) {
        const shouldTake = shouldCpuTakeDiscard_Ultimate(topDiscard, game.cpu, evalCpu);
        if (shouldTake && Math.random() < cpuLevel.discardTakeChance) {
            drawn = game.discard.pop();
            log("CPU drew " + prettyCard(drawn) + " from discard.","cpu");
            render();
            animateCpuTakeFromDiscard(drawn);
            await sleep(800);
        }
    }

    // --- 6. Otherwise draw from stock ---
    if (!drawn) {
        if (!game.stock.length) {
            stockDepletionResolution();
            return;
        }
        drawn = game.stock.pop();
        log("CPU drew from stock.","cpu");
    }

    game.cpu.push(drawn);

    // --- 7. Choose discard using full-hand simulation ---
    const discardIndex = getCpuDiscardUltimate(drawn);

    const [discardCard] = game.cpu.splice(discardIndex, 1);
    cpuDiscardAnimate(discardCard);
    await sleep(100);
    game.discard.push(discardCard);

    log("CPU discarded " + prettyCard(discardCard) + ".","cpu");

    // --- 8. Turn over ---
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
}

/* ============================================================
   DISCARD DECISION: FULL-HAND SIMULATION
   ------------------------------------------------------------
   For each candidate discard:
     - Simulate discarding that card
     - Evaluate resulting hand (melds + deadwood)
     - Apply safety heuristics (avoid feeding opponent)
     - Choose discard that maximizes score
   ============================================================ */

function getCpuDiscardUltimate(drew) {
    const hand = game.cpu.slice(); // copy
    const sorted = sortHandByRank(hand);
    const baseEval = evaluateHand(sorted);
    const meldIds = new Set(baseEval.meldCardIds);

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i];

        // 🚫 Prefer not to discard the card we just drew (but allow if necessary)
        const isDrawn = (c.id === drew.id);

        // 🚫 Never discard a card that is currently in a meld (strong rule)
        if (meldIds.has(c.id)) continue;

        // Simulate discarding this card
        const simulatedHand = sorted.filter(card => card.id !== c.id);
        const simEval = evaluateHand(simulatedHand);

        // Base score: lower deadwood is better
        let score = scoreHandForCpu(simEval);

        // Penalty if this discard is likely to help opponent
        score += opponentSafetyPenalty(c, game.discard, game.opponentKnown || []);

        // Slight penalty for discarding the drawn card (keeps play more human-like)
        if (isDrawn) score -= 1;

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
        } while (hand[idx].id === drew.id || baseEval.meldCardIds.includes(hand[idx].id));
        return idx;
    }

    // Map from sorted index back to real hand index
    const targetId = sorted[bestIndex].id;
    const realIndex = game.cpu.findIndex(c => c.id === targetId);
    return realIndex === -1 ? 0 : realIndex;
}

/* ============================================================
   DISCARD PICKUP DECISION (LOOKAHEAD)
   ------------------------------------------------------------
   Decide whether to take the top discard by simulating:
     - Add discard to hand (11 cards)
     - For each possible discard, evaluate resulting hand
     - Compare best resulting score vs current hand score
   ============================================================ */

function shouldCpuTakeDiscard_Ultimate(topDiscard, hand, currentEval) {
    const currentScore = scoreHandForCpu(currentEval);

    const hypothetical = [...hand, topDiscard];
    const sorted = sortHandByRank(hypothetical);

    let bestScore = -Infinity;

    for (let i = 0; i < sorted.length; i++) {
        const c = sorted[i];

        // Don't simulate discarding the same card we just picked up (pointless)
        if (c.id === topDiscard.id) continue;

        const simHand = sorted.filter(card => card.id !== c.id);
        const simEval = evaluateHand(simHand);
        const score = scoreHandForCpu(simEval);

        if (score > bestScore) {
            bestScore = score;
        }
    }

    // Take discard only if it significantly improves our position
    const improvement = bestScore - currentScore;

    // Threshold can be tuned; higher = more selective
    const threshold = 3;
    return improvement >= threshold;
}

/* ============================================================
   HAND EVALUATION
   ------------------------------------------------------------
   evaluateHand(cards) returns:
     {
       deadwood: number,
       melds: [ [cardIds], ... ],
       meldCardIds: [id, id, ...]
     }
   Steps:
     1) Find best combination of sets and runs (greedy but reasonable)
     2) Compute deadwood from remaining cards
   ============================================================ */

function evaluateHand(cards) {
    const sorted = sortHandByRank(cards);
    const used = new Set();
    const melds = [];

    // --- 1. Find sets (3+ of same rank) ---
    const byRank = groupBy(sorted, c => c.rank);
    for (const rank in byRank) {
        const group = byRank[rank];
        if (group.length >= 3) {
            const meld = group.map(c => c.id);
            melds.push(meld);
            group.forEach(c => used.add(c.id));
        }
    }

    // --- 2. Find runs (3+ in sequence, same suit) ---
    const bySuit = groupBy(sorted, c => c.suit);
    for (const suit in bySuit) {
        const group = bySuit[suit].slice().sort((a, b) => a.rank - b.rank);

        let run = [group[0]];
        for (let i = 1; i < group.length; i++) {
            const prev = group[i - 1];
            const curr = group[i];
            if (curr.rank === prev.rank + 1) {
                run.push(curr);
            } else if (curr.rank === prev.rank) {
                // same rank, skip duplicate
            } else {
                if (run.length >= 3) {
                    const meld = run.map(c => c.id);
                    melds.push(meld);
                    run.forEach(c => used.add(c.id));
                }
                run = [curr];
            }
        }
        if (run.length >= 3) {
            const meld = run.map(c => c.id);
            melds.push(meld);
            run.forEach(c => used.add(c.id));
        }
    }

    // --- 3. Deadwood calculation ---
    let deadwood = 0;
    const meldCardIds = [];
    melds.forEach(m => m.forEach(id => meldCardIds.push(id)));

    for (const c of sorted) {
        if (!used.has(c.id)) {
            deadwood += cardValue(c.rank);
        }
    }

    return {
        deadwood,
        melds,
        meldCardIds
    };
}

/* ============================================================
   CPU SCORING FUNCTION
   ------------------------------------------------------------
   Convert evaluateHand result into a single scalar score.
   Lower deadwood is better; more melds and longer melds are better.
   ============================================================ */

function scoreHandForCpu(evalInfo) {
    const { deadwood, melds } = evalInfo;

    let meldScore = 0;
    for (const meld of melds) {
        const len = meld.length;
        // Reward longer melds more than linearly
        meldScore += len * len; // 3->9, 4->16, etc.
    }

    // Deadwood penalty
    const deadwoodPenalty = deadwood * 2;

    return meldScore - deadwoodPenalty;
}

/* ============================================================
   OPPONENT SAFETY HEURISTICS
   ------------------------------------------------------------
   Simple, understandable model:
     - Avoid discarding cards that are adjacent or same-rank to
       cards the opponent has visibly taken from discard.
   ============================================================ */

function opponentSafetyPenalty(card, discardPile, opponentKnown) {
    let penalty = 0;

    // opponentKnown: cards we know opponent picked from discard
    // (you can maintain this array elsewhere in your game logic)
    for (const oc of opponentKnown) {
        if (oc.suit === card.suit) {
            const diff = Math.abs(oc.rank - card.rank);
            if (diff === 1) penalty -= 3; // likely completes/extends a run
            if (diff === 2) penalty -= 1; // potential near-run
        }
        if (oc.rank === card.rank) {
            penalty -= 4; // likely completes a set
        }
    }

    return penalty;
}

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

function sortHandByRank(hand) {
    return hand.slice().sort((a, b) => a.rank - b.rank || a.suit.localeCompare(b.suit));
}

function groupBy(arr, keyFn) {
    const map = {};
    for (const item of arr) {
        const key = keyFn(item);
        if (!map[key]) map[key] = [];
        map[key].push(item);
    }
    return map;
}

// Standard Gin Rummy card value: A=1, 2-10=face value, J/Q/K=10
function cardValue(rank) {
    if (rank === 1) return 1;
    if (rank >= 2 && rank <= 10) return rank;
    return 10;
}

/* ============================================================
   NOTES / HOOKS
   ------------------------------------------------------------
   - cpuLevel.knockChance, cpuLevel.discardTakeChance, cpuLevel.discardMistake
     are assumed to exist (as in your current code).
   - game.opponentKnown is an optional array of cards the opponent
     has visibly taken from the discard pile; you can maintain it
     when the player picks from discard.
   - This AI is:
       * Methodological: clear phases, consistent evaluation
       * Understandable: each step is explicit and local
       * Strong: full-hand simulation for both discard pickup and discard choice
   ============================================================ */
