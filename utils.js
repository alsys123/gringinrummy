
/* ------------------------------
     General Backdoor
  ------------------------------ */

const gBackDoorLock = 3;  // when to open/close back door
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


function showGameStats() {

//    const winnerLine = result.winner
//	  ? `Result Type: ${result.type}  Result Winner: ${result.winner}\n`
//	  : `\n`;
    
    const stats =
	  `*** Game Statistics ***\n` +
	  `Game Turn: ${game.turn}   Game Phase: ${game.phase}\n` +
//	  winnerLine +
	  `\n` +
	  `Match Score:\n` +
	  `You: ${matchScore.player}\n` +
	  `CPU: ${matchScore.cpu}    MatchScore Target: ${matchScore.target}` +
	  `\n\n` +
	  `---`;
    

    showMessage(stats);
    
}

