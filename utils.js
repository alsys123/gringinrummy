
/* ------------------------------
     General Backdoor
  ------------------------------ */

const gBackDoorLock = 3;  // when to open/close back door .. 3 is good
let   gBackDoorCode = 0;
let   gBackDoorDir = 1; // +1 going up, -1 going down ... the direction

function openCloseBackDoor() {
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
/*
    // open a back door to save and restore game states
function openCloseBackDoor() {
//    gBackDoorCode++;
	//	console.log("Back door - double click: ", gBackDoorCode);
	if (gBackDoorCode > 3 ) {
//	    dec(gBackDoorCode);
	    gBackDoorCode = Math.max(0, gBackDoorCode - 1);
	    document.getElementById("back-door").hidden = false;
	    console.log("code -: ", gBackDoorCode);
	}
	if (gBackDoorCode <= 3 ) {
	    //	gBackDoorCode++;
//	    inc(gBackDoorCode);
	    gBackDoorCode = Math.min(4, gBackDoorCode + 1);
	    document.getElementById("back-door").hidden = true;
	    console.log("code+ : ", gBackDoorCode);
	}
    } // openCloseBackDoor
*/


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

	    updateScoreboard();
	    render();
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

// toggle log display
document.getElementById("btn-backDoor-showLog").onclick = () => {
    toggleShowlog();
}

function toggleShowlog() {
    // hide the log
    if (gshowLog)  {
	log("hide the log","sys");
	gshowLog = false;
	document.getElementById("log").hidden = true;
	return;
    }

    // show the log
    if (!gshowLog) {
	log("show the log","sys");
	gshowLog = true;
	document.getElementById("log").hidden = false;
	return;
    }

} //toggleShowlog

function log(t) {
    const p = document.createElement("p");
    p.textContent = t;
    el.log.prepend(p);
  }


function log(message, type) {    
  const p = document.createElement("p");
  p.textContent = message;

  // Inline color coding
  if (type === "sys")   p.style.color = "red";
  if (type === "cpu")   p.style.color = "blue";
  if (type === "player") p.style.color = "green";
  if (type === "warn")  p.style.color = "orange";

  el.log.prepend(p);
}

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


    /* datastructure
    const gameData = {
	gameNumber: detailedMatchScore.games.length + 1,
	winner, type, who,
	deadwood: {player: pDW, cpu: cDW, diff: dDW },
	bonus: { bonus, type },
	layoff: {player: 0, cpu: 0 },
	pointsThisGame,
	accumulated: {player: pPoints, cpu: cPoints}
    };

     */
// Scoreboard is clicked
function scoreBoardDetails() {
  if (detailedMatchScore.games.length === 0) {
    showMessage("No games played yet.");
    return;
  }

    let out = "--- Detailed Score Board ---" + "\n" + "\n";
    

    let deadwoodThisGame;
    let bonusLine = "";

    let lastPlayer = 0;
    let lastCpu    = 0;
    let runningLine = "";
    
    detailedMatchScore.games.forEach(g => {
	bonusLine = "";  // initialize it

	// ??? conditions need to be finished.. like for bonus

	
	if (g.layoff > 0 && g.who === "player" && g.winner === "player" && g.type == "knock") {
	    bonusLine = `CPU Deadwood is ${g.deadwood.cpu} = ` +
		`${g.originalDW} - ${g.layoff} layoff` + "\n";
	}
	if (g.layoff > 0 && g.who === "cpu" && g.winner === "cpu" && g.type == "knock") {
	    bonusLine = `Player Deadwood is ${g.deadwood.player} = ` +
		`${g.originalDW} - ${g.layoff} layoff` + "\n";
	}
	
	    
//	if (g.bonus.bonus === 0 && g.layoff === 0 ) {
//	    bonusLine = "";
//	} else {
//	    bonusLine = `Bonus: ${g.bonus.bonus} ${g.bonus.type}   ` +
//		`Layoffs: ${g.layoff} ` + "\n";
//	}
	
	if (g.winner === "player") {
	    runningLine = `Running: ${g.accumulated.player} (${lastPlayer} + ${g.pointsThisGame})  vs  ${g.accumulated.cpu}`;
	} else {
	    runningLine = `Running: ${g.accumulated.player}  vs  ${g.accumulated.cpu} (${lastCpu} + ${g.pointsThisGame})`;
	}

	let calcLine = `${g.deadwood.player} vs ${g.deadwood.cpu} ➜ ${g.deadwood.diff}`;
	if (g.type === "gin" && g.winner === "player") {
	    calcLine = `${g.deadwood.cpu} + 25 points bonus for GIN`;
	}
	if (g.type === "gin" && g.winner === "cpu") {
	    calcLine = `${g.deadwood.player} + 25 points bonus for GIN`;
	}

	out += "____" + "\n";
	out += `Game ${g.gameNumber}: ${g.winner.toUpperCase()} wins! ` +
	    `( ${g.type} by ${g.who} )` + "\n";
	
//	out += `${g.deadwood.player} vs ${g.deadwood.cpu} ➜ ${g.deadwood.diff}` + "\n" ;
	out += calcLine + "\n" ;
	out += bonusLine;
	
	out += `${g.winner} gets ${g.pointsThisGame} points` + "\n";

	out += runningLine + "\n";
//	out += `Running: ${g.accumulated.player}  vs  ${g.accumulated.cpu}`;
	
	out += "\n";

	lastPlayer = g.accumulated.player;
	lastCpu    = g.accumulated.cpu;
	
    }); // for each
    
    showMessage(out);
}

// do not really use this anymore
function formatRow(desc, player, cpu) {
    const col1 = desc.padEnd(20, " ");
    const col2 = String(player).padStart(7, " ");
    const col3 = String(cpu).padStart(7, " ");
    return `${col1}${col2}${col3}\n`;
}

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
    });

}//showDeckSelector


// this is for a pause function: await sleep(2000); // pause 2 seconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


makeModalDraggable(document.getElementById("modal-content"), 
                   document.getElementById("modal-header"));

function makeModalDraggable(modal, handle) {
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    // Mouse
    handle.addEventListener("mousedown", dragStartMouse);
    // Touch
    handle.addEventListener("touchstart", dragStartTouch, { passive: false });

    function dragStartMouse(e) {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
        document.addEventListener("mousemove", dragMoveMouse);
        document.addEventListener("mouseup", dragEndMouse);
    }

    function dragStartTouch(e) {
        e.preventDefault();
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
        document.addEventListener("touchmove", dragMoveTouch, { passive: false });
        document.addEventListener("touchend", dragEndTouch);
    }

    function startDrag(x, y) {
        startX = x;
        startY = y;
        initialLeft = modal.offsetLeft;
        initialTop = modal.offsetTop;
        modal.style.position = "absolute";
    }

    function dragMoveMouse(e) {
        dragTo(e.clientX, e.clientY);
    }

    function dragMoveTouch(e) {
        e.preventDefault();
        const t = e.touches[0];
        dragTo(t.clientX, t.clientY);
    }

    function dragTo(x, y) {
        const dx = x - startX;
        const dy = y - startY;
        modal.style.left = initialLeft + dx + "px";
        modal.style.top = initialTop + dy + "px";
    }

    function dragEndMouse() {
        document.removeEventListener("mousemove", dragMoveMouse);
        document.removeEventListener("mouseup", dragEndMouse);
    }

    function dragEndTouch() {
        document.removeEventListener("touchmove", dragMoveTouch);
        document.removeEventListener("touchend", dragEndTouch);
    }
}

/*
function makeModalDraggable(modal, handle) {
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

    handle.onmousedown = dragStart;

    function dragStart(e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;

        document.onmousemove = dragMove;
        document.onmouseup = dragEnd;
    }

    function dragMove(e) {
        e.preventDefault();
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;

        startX = e.clientX;
        startY = e.clientY;

        modal.style.top = (modal.offsetTop + offsetY) + "px";
        modal.style.left = (modal.offsetLeft + offsetX) + "px";
        modal.style.position = "absolute";
    }

    function dragEnd() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
*/
