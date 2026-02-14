
/* ------------------------------
     General Backdoor
  ------------------------------ */

const gBackDoorLock = 3;  // when to open/close back door .. 3 is good
let gBackDoorCode = 0;
let gBackDoorDir = 1; // +1 going up, -1 going down ... the direction

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
  const data = JSON.stringify({game,matchScore}, null, 2); // pretty JSON

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
     Show game statistics
  ------------------------------ */

document.getElementById("btn-backDoor-showStats").onclick = () => {
    showGameStats();
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
const cards = sortedPlayerFinal
  .slice()
  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`);

let playerHand = "";
for (let i = 0; i < cards.length; i++) {
  if (i > 0 && i % 5 === 0) playerHand += "\n";  // new line every 5 cards
  playerHand += cards[i] + ", ";
}

    const cpuHand =
	  sortedCpuFinal
	  .slice()
//	  .map(c => `${c.rank}${c.suit}(r:${c.runValue},d:${c.deadwoodValue},id:${c.id})`)
	  .map(c => `${c.rank}${c.suit}(${c.runValue},${c.deadwoodValue},${c.id})`)
	  .join(", ");


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
	  "Player Hand: "  + playerHand + "\n" +
	   meldPlayerResults + "\n" + "\n" +
	  "CPU Hand   : "  + cpuHand + "\n" +
	   meldCpuResults    + "\n" + "\n" +
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

    let out = "Detailed Score Board" + "\n" + "\n";
    

    let deadwoodThisGame;
    let bonusLine = "";

    let lastPlayer = 0;
    let lastCpu    = 0;
    let runningLine = "";
    
    detailedMatchScore.games.forEach(g => {
	
	if (g.bonus.bonus === 0 && g.layoff.player === 0 && g.layoff.cpu === 0) {
	    bonusLine = "";
	} else {
	    bonusLine = `Bonus: ${g.bonus.bonus} ${g.bonus.type}   ` +
		`Layoffs: ${g.layoff.player} ${g.layoff.cpu}` + "\n";
	}
	
	if (g.winner === "player") {
	    runningLine = `Running: ${g.accumulated.player} (${lastPlayer} + ${g.pointsThisGame})  vs  ${g.accumulated.cpu}`;
	} else {
	    runningLine = `Running: ${g.accumulated.player}  vs  ${g.accumulated.cpu} (${lastCpu} + ${g.pointsThisGame})`;
	}
				     
	out += "____" + "\n";
	out += `Game ${g.gameNumber}: ${g.winner.toUpperCase()} wins! ` +
	    `( ${g.type} by ${g.who} )` + "\n";
	
	out += `${g.deadwood.player} vs ${g.deadwood.cpu} ➜ ${g.deadwood.diff}` + "\n" ;
	
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

