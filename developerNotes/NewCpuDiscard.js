
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
