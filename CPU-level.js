const cpuDifficulty = {
    easy: {
        discardTakeChance: 0.40,   // 40% chance to take a good discard
        knockChance: 0.50,         // knocks only half the time
        discardMistake: 0.50       // 50% chance to discard a worse card
    },
    medium: {
        discardTakeChance: 0.70,
        knockChance: 0.80,
        discardMistake: 0.25
    },
    hard: {
        discardTakeChance: 1.00,   // always optimal
        knockChance: 1.00,
        discardMistake: 0.00
    }
};

// choose difficulty here
let cpuLevel = cpuDifficulty.medium;

async function cpuTurn() {

    log("cpuTurn","sys");
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
            await sleep(800);
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
    const idx = cpuChooseDiscardIndexWithDifficulty();
    const [d] = game.cpu.splice(idx,1);

    cpuDiscardAnimate(d);
    game.discard.push(d);

    log("CPU discarded " + prettyCard(d) + ".","cpu");

    game.turn = "player";
    game.phase = "await-draw";
    setMsg("Draw from stock or discard.");

    updateButtons();
    await sleep(300);
    render();
    updateButtons();
}

function cpuChooseDiscardIndexWithDifficulty() {
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
}
