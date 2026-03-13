/* ------------------------------
     Backdoor
  ------------------------------ */

const gBackDoorLock = 2;  // when to open/close back door .. 3 is good
let   gBackDoorCode = 0;
let   gBackDoorDir = 1; // +1 going up, -1 going down ... the direction

function openCloseBackDoor() {
    log("Open back door","sys");
    // Step the counter
    gBackDoorCode += gBackDoorDir;
    
    // Clamp and flip direction at the ends
    if (gBackDoorCode >= gBackDoorLock) {
	gBackDoorCode = gBackDoorLock;
	gBackDoorDir = -1; // start going down
    } else if (gBackDoorCode <= 0) {
	gBackDoorCode = 0;
	gBackDoorDir = 1; // start going up
    }
    
    // Show only when fully open
    const open = gBackDoorCode === gBackDoorLock;
    document.getElementById("back-door").hidden = !open;
    
    //  console.log("code:", gBackDoorCode, "dir:", gBackDoorDir, "open:", open);
}

  /* ------------------------------
     Save and restore -- file states
  ------------------------------ */


document.getElementById("btn-backDoor-restore").onclick = () => {
    document.getElementById("load-file").click();
};

document.getElementById("load-file").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
	loadGameFromFile(e.target.files[0]);
    }
});



function saveGameToFile() {
    const data = JSON.stringify({game,matchScore,detailedMatchScore}, null, 2); // pretty JSON

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ginrummy-save.json";
  a.click();

  URL.revokeObjectURL(url);
}

function loadGameFromFile(file) {
    const reader = new FileReader();
    
    reader.onload = () => {
	try {
	    const cleaned = stripJsonComments(reader.result);
	    const obj = JSON.parse(cleaned);
	    
	    // Restore all fields into the existing game object
	    Object.assign(game, obj.game);
	    Object.assign(matchScore, obj.matchScore);

	    // Restore optional field (newer saves)
	    if (obj.detailedMatchScore) {
		Object.assign(detailedMatchScore, obj.detailedMatchScore);
	    } else {
		// If missing, initialize it safely
		detailedMatchScore.games = [];
	    }

	    // one time cleanup
//	    delete game.game;    
//	    delete game.matchScore?.matchScore;
	    // -- end of cleanup

	    // reset the playing board
    //show again
    document.getElementById("center-area").style.display = "flex";
    document.getElementById("deadwood-info").style.display = "block";

    // hide
    document.getElementById("tally-area").style.display = "none";
    document.getElementById("tally-area").innerHTML = "";

//    document.getElementById("star-ml").style.color = cpuColors[currentCpuLevel];
    showCPUlevel(currentCpuLevel);

	    
	    updateScoreboard();
	    render();
	    updateButtons();
	    setMsg("Game restored.");
	} catch (err) {
	    console.error("Error loading save:", err);
	    setMsg("Invalid save file.");
	}
    };
    
    reader.readAsText(file);
    
}


function stripJsonComments(str) {
  return str
    .replace(/\/\/.*$/gm, "")          // remove //
    .replace(/\/\*[\s\S]*?\*\//gm, "") // remove /* */
    .trim();
}

function openLoadDialog() {
  document.getElementById("load-file").click();
}

  /* ------------------------------
     Settings
  ------------------------------ */

document.getElementById("btn-backDoor-settings").onclick = () => {
    showSettings();
}


//
function log(message, type = "normal") {
    
    logHistory.push({ message, type, time: new Date().toISOString() });

    const p = document.createElement("p");
    p.textContent = message;

  // Inline color coding
  if (type === "sys")     p.style.color = "white";
  if (type === "cpu")     p.style.color = "yellow";
  if (type === "player")  p.style.color = "green";
  if (type === "warn")    p.style.color = "orange";
  if (type === "normal")  p.style.color = "pink";

  el.log.prepend(p);
} //log

function downloadLog() {
  let text = "";

  for (const entry of logHistory) {
    text += `[${entry.time}] (${entry.type}) ${entry.message}\n`;
  }

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "game-log.txt";
  a.click();

  URL.revokeObjectURL(url);
} //downloadLog


function setMsg(t) {
    el.msg.textContent = t;
}

// another day ... grab ...     el.cpu.innerHTML = ""; 
/// then use logCpuFanBounds  to see where the cpu cards are placed.

//__showGameStats
function showGameStats() {

    // clear out the modal box first
    document.getElementById("modal-extra").innerHTML = "";
    document.getElementById("modal-text").innerHTML = "";

//    const winnerLine = result.winner
//	  ? `Result Type: ${result.type}  Result Winner: ${result.winner}\n`
//	  : `\n`;
    const gameBoard = document.getElementById("game");
    const w = gameBoard.clientWidth;
    const h = gameBoard.clientHeight;
    
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    // Print the player and CPU hands
    const evalCpu            = evaluate(game.cpu);
    const sortedCpuFinal     = sortHandWithMeldsFirstv2(game.cpu, evalCpu.melds);
    const meldCpuResults     = formatAllResults(allMeldResults);

    const evalPlayer         = evaluate(game.player);
    const sortedPlayerFinal  = sortHandWithMeldsFirstv2(game.player, evalPlayer.melds);
    const meldPlayerResults  = formatAllResults(allMeldResults);

    const cardsPlayer = sortedPlayerFinal
	  .slice()
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`);

    const deadwoodCardsPlayer = evalPlayer.deadwoodCards
	  .slice()
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`);

    const cardsCpu = sortedCpuFinal
	  .slice()
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`);

    const deadwoodCardsCpu = evalCpu.deadwoodCards
	  .slice()
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`);
    
    let playerHand = "";
    for (let i = 0; i < cardsPlayer.length; i++) {
	if (i > 0 && i % 5 === 0) playerHand += "\n";  // new line every 5 cards
	playerHand += cardsPlayer[i] + ", ";
    }

    let cpuHand = "";
    for (let i = 0; i < cardsCpu.length; i++) {
	if (i > 0 && i % 5 === 0) cpuHand += "\n";  // new line every 5 cards
	cpuHand += cardsCpu[i] + ", ";
    }

    
    const stats =
	  `*** Game Statistics ***` + "\n" +
	  `Game Turn: ${game.turn}   Game Phase: ${game.phase}` + "\n" +
	  //	  winnerLine +
	  `\n` +
	  `CPU Level:  ${currentCpuLevel}` + "\n" +
	  `CPU Strategy: ${cpuStrategy}` + "\n" +
	  `Match Score:` + "\n" +
	  `You: ${matchScore.player}` + "\n" +
	  `CPU: ${matchScore.cpu}    MatchScore Target: ${matchScore.target}` + "\n" + "\n" +
	  `GameBoard is ${w} wide and ${h} high` + "\n" + "\n" +
	  `GameBoard viewable at ${iw} wide and ${ih}` + "\n" + "\n" +
	  "rank-suite(runvalue, deadwoodValue, id)" + "\n" +
	  // Player
	  "Player Hand: " + "\n" +
	  playerHand + "\n" +
	  meldPlayerResults + "\n" + 
	  "Player Deadwood: " + deadwoodCardsPlayer + "\n" + "\n" +
	  // CPU
	  "CPU Hand: " + "\n"  +
	  cpuHand + "\n" +
	  meldCpuResults    + "\n" +
	  "CPU Deadwood: " + deadwoodCardsCpu + "\n" + "\n" +
	  `---`;
    
    showMessage(stats);

    // **** experimenting with changing the size of a hand
//    const cpu = document.getElementById("cpu-hand");
//    const rect = cpu.getBoundingClientRect();  
//    const originalX = rect.left;
//    const originalY = rect.top;
//    console.log(originalX + "X  Y=" + originalX);
//    cpu.style.transformOrigin = "top left";
//    cpu.style.transform = "scale(0.7)";
//    const originalX = 800;
//    const originalY = 100;
//    cpu.style.transform = `translate(${originalX}px, ${originalY}px) scale(0.7)`;


} //showGameStats

//__formatAllResults
function formatAllResults(results) {
  return results.map(r =>
      `${r.pattern}, DW=${r.dwValue}, ` +
	  `Melds: ${JSON.stringify(r.melds.map(m => m.map(c => c.id)))}, ` +
    `DW Cards: ${r.dw.map(c => `${c.rank}${c.suit}`).join(" ")}`
  ).join("\n");
}


function showSettings() {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear the settings

    document.getElementById("modal-text").innerHTML = "&nbsp;"; // avoid collapse

    document.querySelector(".modal-content").style.width = "480px";

    
    // *** These are the Setting components ***    
    extra.appendChild(buildShowButton("Save 'QA Game State' to file", saveGameToFile));    

    extra.appendChild(
	buildShowButton("Restore 'QA Game State; from File", () => {
            document.getElementById("load-file").click();
	})
    );
    
    extra.appendChild(buildDeckSelector());
//    extra.appendChild(buildAutoPlayerToggle());

    extra.appendChild(buildCPUStrategySelector());
    
    extra.appendChild(
	buildCheckboxToggle(
            "Auto Player Mode",
            () => autoPlayer,
            (v) => autoPlayer = v
	)
    );
    
//    extra.appendChild(buildShowLogToggle());
extra.appendChild(
    buildCheckboxToggle(
        "Show Log",
        () => gshowLog,
        (v) => {
            gshowLog = v;
            document.getElementById("log").hidden = !v;
        }
    )
);
    
//    extra.appendChild(buildSaveLogButton());
    extra.appendChild(buildShowButton("Download Log File", downloadLog));

//    extra.appendChild(buildShowCpuCardsToggle());
    extra.appendChild(
	buildCheckboxToggle( "Show CPU Cards", () =>
	    game.revealCpu,
	    (v) => {
		game.revealCpu = v;
		render();
		updateButtons();
	    }
	)
    );
    
//    extra.appendChild(buildUnitTestMeldsButton());
    extra.appendChild(buildShowButton("Unit Test Melds", testMelds));    
    extra.appendChild(buildShowButton("Show Game Stats", showGameStats));    
    

    showMessage("Settings");
}//showSettings

function buildDeckSelector() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.textContent = `Choose a card deck (currently: ${gCardDeck}):`;
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const select = document.createElement("select");
    select.id = "deck-select";
    select.style.width = "100%";
    select.style.padding = "6px";

    const decks = [
        { value: "na",      label: "--- No Change ---" },
        { value: "classic", label: "Classic Deck" },
        { value: "jumbo",   label: "Jumbo Deck" },
        { value: "simple",  label: "Simple Deck" }
    ];

    decks.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.value;
        opt.textContent = d.label;
        select.appendChild(opt);
    });

    select.addEventListener("change", e => {
        if (e.target.value === "na") return;
        gCardDeck = e.target.value;
        render();
        updateButtons();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
}//buildDeckSelector

function buildCPUStrategySelector() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.textContent = `Choose a CPU Strategy (currently: ${cpuStrategy}):`;
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const select = document.createElement("select");
    select.id = "deck-select";
    select.style.width = "100%";
    select.style.padding = "6px";

    const decks = [
        { value: "na", label: " --- No Change ---" },
        { value: "a",  label: "a: Original (default) strategy" },
        { value: "b",  label: "b: Pick the best melds" },
        { value: "c",  label: "c: Same as b but do not always discard higest card" },
        { value: "d",  label: "d: Ultra" }
    ];

    decks.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.value;
        opt.textContent = d.label;
        select.appendChild(opt);
    });

    select.addEventListener("change", e => {
        if (e.target.value === "na") return;

        cpuStrategy = e.target.value;

        render();
        updateButtons();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
}//buildCpuStrategySelector

/*
function buildAutoPlayerToggle() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.textContent = "Auto Player Mode:";
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "auto-player-toggle";
    checkbox.checked = autoPlayer === true;

    checkbox.addEventListener("change", () => {
        autoPlayer = checkbox.checked;
//        console.log("Auto Player:", game.autoPlay);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(checkbox);
    return wrapper;
    
}//buildAutoPlayerToggle
*/
/*
function buildSaveLogButton() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const button = document.createElement("button");
    button.textContent = "Download Log File";
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        downloadLog();
    });

    wrapper.appendChild(button);
    return wrapper;
}//buildSaveLogButton
*/
/*
function buildShowLogToggle() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-log-toggle";
    checkbox.checked = gshowLog === true;

    const text = document.createElement("span");
    text.textContent = "Show Log";
    text.style.color = "black";

    checkbox.addEventListener("change", () => {
        gshowLog = checkbox.checked;
        document.getElementById("log").hidden = !gshowLog;
        log(gshowLog ? "show the log" : "hide the log", "sys");
    });

    row.appendChild(checkbox);
    row.appendChild(text);
    wrapper.appendChild(row);

    return wrapper;
}//buildShowLogToggle
*/
/*
function buildShowCpuCardsToggle() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "show-cpu-cards-toggle";
    checkbox.checked = game.revealCpu === true;

    const text = document.createElement("span");
    text.textContent = "Show CPU Cards";
    text.style.color = "black";   // ensures visibility

    checkbox.addEventListener("change", () => {
        game.revealCpu = checkbox.checked;
        render();
        updateButtons();
    });

    row.appendChild(checkbox);
    row.appendChild(text);
    wrapper.appendChild(row);

    return wrapper;
}//buildShowCpuCardsToggle
*/
/*
function buildUnitTestMeldsButton() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const button = document.createElement("button");
    button.textContent = "Unit Test Melds";
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        testMelds();
    });

    wrapper.appendChild(button);
    return wrapper;
}//buildUnitTestMeldsButton

function buildShowGameStatsButton() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const button = document.createElement("button");
    button.textContent = "Unit Test Melds";
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        showGameStats();
    });

    wrapper.appendChild(button);
    return wrapper;
}//buildShowGameStatsButton
*/
function buildShowButton(label, handler) {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const button = document.createElement("button");
    button.textContent = label;
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";

    button.addEventListener("click", handler);

    wrapper.appendChild(button);
    return wrapper;
}//buildShowButton

function buildCheckboxToggle(label, getValue, setValue) {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = getValue();

    const text = document.createElement("span");
    text.textContent = label;
    text.style.color = "black";

    checkbox.addEventListener("change", () => {
        setValue(checkbox.checked);
    });

    row.appendChild(checkbox);
    row.appendChild(text);
    wrapper.appendChild(row);

    return wrapper;
}//buildCheckboxToggle
