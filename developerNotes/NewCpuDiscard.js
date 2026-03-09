function cpuChooseDiscardIndex_DifficultV2() {
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
}

.... also decide whether to take the discard:
// Decide whether to take discard
if (topDiscard) {
    const hypothetical = [...game.cpu, topDiscard];
    const evalWith = evaluate(hypothetical);

    const improvement = evalWith.deadwood + 1 <= cDW;

    // --- NEW: evaluate meld potential ---
    let rankPotential = 0;
    let runPotential = 0;

    for (const c of game.cpu) {
        if (c.rank === topDiscard.rank) {
            rankPotential += 6; // strong incentive
        }
        if (c.suit === topDiscard.suit) {
            const diff = Math.abs(c.rank - topDiscard.rank);
            if (diff === 1) runPotential += 5; // adjacent
            if (diff === 2) runPotential += 2; // near-adjacent
        }
    }

    // --- NEW: high card penalty (only if no potential) ---
    const highPenalty =
        (topDiscard.rank >= 10 && rankPotential === 0 && runPotential === 0)
            ? -4
            : 0;

    // --- NEW: final desirability score ---
    const desirability =
        (improvement ? 10 : 0) +
        rankPotential +
        runPotential +
        highPenalty;

    // --- NEW: difficulty-based decision ---
    const threshold = 8 * cpuLevel.discardTakeChance;

    if (desirability >= threshold) {
        drawn = game.discard.pop();
        log("CPU drew " + prettyCard(drawn) + " from discard.","cpu");
        render();
        animateCpuTakeFromDiscard(drawn);
        await sleep(2000);
    }
}
