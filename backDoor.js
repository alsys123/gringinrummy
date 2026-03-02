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

// hooks
document.getElementById("btn-backDoor-save").onclick = () => {
    saveGameToFile();
    }

document.getElementById("btn-backDoor-restore").onclick = () => {
    document.getElementById("load-file").click();
};

document.getElementById("load-file").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
	loadGameFromFile(e.target.files[0]);
    }
});

document.getElementById("btn-backDoor-testMelds").onclick = () => {
    testMelds();
};


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

    document.getElementById("star-ml").style.color = cpuColors[currentCpuLevel];

	    
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
     Show the CPU cards using the back door
  ------------------------------ */

document.getElementById("btn-backDoor-showCpuCards").onclick = () => {
    game.revealCpu = !game.revealCpu;
    render();
    updateButtons();
//    console.log("Game object: ", game)
}
  /* ------------------------------
     Let us pick a card deck
  ------------------------------ */

document.getElementById("btn-backDoor-pickCardDeck").onclick = () => {
    showDeckSelector();
}

  /* ------------------------------
     Show game statistics
  ------------------------------ */

document.getElementById("btn-backDoor-showStats").onclick = () => {
    showGameStats();
}

// save log file
document.getElementById("btn-backDoor-saveLogFile").onclick = () => {
    downloadLog();
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
/*
    const playerHand =
	  sortedPlayerFinal
	  .slice()
//	  .map(c => `${c.rank}${c.suit}(r:${c.runValue},d:${c.deadwoodValue},id:${c.id})`)
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`)
	  .join(", ");
	  */

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

/*    
    const cpuHand =
	  sortedCpuFinal
	  .slice()
    //	  .map(c => `${c.rank}${c.suit}(r:${c.runValue},d:${c.deadwoodValue},id:${c.id})`)
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`)
	  .join(", ");
  */  
    
    // results of meld and deadwood tes
    //    solveHand(playerHand);
    
    //    console.log("in status: ", allResultsPlayer);
    
    const stats =
	  `*** Game Statistics ***` + "\n" +
	  `Game Turn: ${game.turn}   Game Phase: ${game.phase}` + "\n" +
	  //	  winnerLine +
	  `\n` +
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

/*
//__showDeckSelector
// select a card deck to use...
function showDeckSelector() {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear previous content

    const label = document.createElement("label");
    label.textContent = "Choose a card deck:";
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const select = document.createElement("select");
    select.id = "deck-select";
    select.style.width = "100%";
    select.style.padding = "6px";
    select.style.marginBottom = "12px";

    // Add your deck options here .. picking carddeck
    const decks = [
        { value: "na",      label: "--- No Change ---" },
        { value: "classic", label: "Classic Deck" },
        { value: "jumbo",   label: "Jumbo Deck" },
        { value: "simple",   label: "Simple Deck" }
	
//        { value: "minimal", label: "Minimalist Deck" },
//        { value: "casino", label: "Casino Deck" }
    ];

    decks.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.value;
        opt.textContent = d.label;
        select.appendChild(opt);
    });

    extra.appendChild(label);
    extra.appendChild(select);

    showMessage("Select a card deck");

    document.getElementById("deck-select").addEventListener("change", (e) => {

	if (e.target.value === "na") return;
	
	gCardDeck = e.target.value;
//	console.log("Changed to:", e.target.value);
//	start();
	render();
	updateButtons();
    });

}//showDeckSelector
*/
// !!!!just for now
function showDeckSelector() {
    showSettings();
}

function showSettings() {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear the settings

    document.getElementById("modal-text").innerHTML = "&nbsp;"; // avoid collapse
    
    extra.appendChild(buildDeckSelector());
    extra.appendChild(buildAutoPlayerToggle());
    extra.appendChild(buildShowLogToggle()); // ← new worker
    extra.appendChild(buildSaveLogToggle());

    showMessage("Settings");
}//showSettings

function buildDeckSelector() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.textContent = "Choose a card deck:";
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

function buildSaveLogToggle() {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.textContent = "Save Log File:";
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "save-log-toggle";
    checkbox.checked = game.saveLog === true;

    checkbox.addEventListener("change", () => {
        game.saveLog = checkbox.checked;
        console.log("Save Log:", game.saveLog);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(checkbox);
    return wrapper;
}//buildSaveLogToggle

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
