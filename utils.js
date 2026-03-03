/* ------------------------------
   Utils
   ------------------------------ */



function showMessage(msg) {
	const padded = msg + "\n\n"; // always add two newlines
	document.getElementById("modal-text").textContent = padded;
	document.getElementById("modal").style.display = "flex";
} // showMessage

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
	showMessage("No rounds played yet.");
	return;
    }
  const actionText = {
	bigGin: {
	    player: "You went BIG Gin!",
	    cpu: "CPU went BIG Gin!"
	},
	gin: {
	    player: "You went Gin!",
	    cpu: "CPU went Gin!"
	},
	knock: {
	    player: "You knocked.",
	    cpu: "CPU knocked."
	},
	stock: {
	    na: "Stock depleted."
	},
	undercut: {
	    player: "You knocked.",
	    cpu:    "CPU knocked."
	}
    };
    const resultText = {
	player: "You won the hand.",
	cpu: "CPU won the hand.",
	tie: "Deadwood tie."
    };
    
    let out = "--- Detailed Score Board ---" + "\n" + "\n";

    let deadwoodThisGame;
    let bonusLine = "";

    let lastPlayer = 0;
    let lastCpu    = 0;
    let runningLine = "";
    
    detailedMatchScore.games.forEach(g => {
	pointsThisHandCalc = "";

	const actor  = g.who;      // player, cpu, or na
	const winner = g.winner;  // player, cpu, tie
	const type   = g.type;      // gin, knock, stock, undercut, bigGin
    
	let title = actionText[type][actor];

	bonusLine = "";  // initialize it

	// **** calc title ****
	// Stock has no winner
	if (type !== "stock") {
	    title += " " + resultText[winner];
	}
	if(g.who === "player" && g.winner === "player") {
	    title = "You WON!";
	}
	if(g.who === "cpu" && g.winner === "cpu") {
	    title = "CPU won!";
	}
	//  ****
	
	const cDW = g.deadwood.cpu;
	const pDW = g.deadwood.player;
	
	// **** Deadwood and pointsThisHane lines calc ****.
    yourDeadwoodLine = `Your deadwood: ${pDW}`;
    cpuDeadwoodLine  = `CPU deadwood: ${cDW}`;

    // about player layoffs ----------
    if (actor === "cpu" && g.layoff > 0 && type === "knock") {
	yourDeadwoodLine = `Your deadwood: ${pDW}` +
	    ` (${g.originalDW} - ${g.layoff} layoffs)`;
    }
    
    if (actor === "cpu" && type === "knock" &&
	g.winner === "cpu") {
	pointsThisHandCalc =
	    " = ( " + `${pDW} - ${cDW}` + " )";
    }

    // about CPU layoffs -----------
    if (actor === "player" && g.layoff > 0 && type === "knock") {
	cpuDeadwoodLine  = `CPU deadwood: ${cDW}` +
	    ` (${g.originalDW} - ${g.layoff} layoffs)`;
	pointsThisHandCalc =
	    " = ( " + `${cDW} - ${pDW}` + " )";
    } 

    if (actor === "player" && type === "knock" &&
	g.winner === "player") {
	pointsThisHandCalc =
	    " = ( " + `${cDW} - ${pDW}` + " )";
    } 

    if (actor === "cpu" && g.type === "gin") {
	pointsThisHandCalc = " = ( " + `${pDW} + 25 Bonus points for gin` + " )";
    }
    if (actor === "cpu" && g.type === "undercut") {
	pointsThisHandCalc = " = ( " + `${cDW} + 10 Bonus points for an undercut` + " )";
    }
    
    if (actor === "player" && g.type === "gin") {
	pointsThisHandCalc = " = ( " + `${cDW} + 25 Bonus points for gin` + " )";
    }
    if (actor === "player" && g.type === "undercut") {
	pointsThisHandCalc = " = ( " + `${pDW} + 10 Bonus points for an undercut` + " )";
    }

    //bigGin
    if (actor === "cpu" && g.type === "bigGin") {
	pointsThisHandCalc = " = ( " + `${pDW} + 31 Bonus points for BIG Gin` + " )";
    }
    if (actor === "player" && g.type === "bigGin") {
	pointsThisHandCalc = " = ( " + `${cDW} + 31 Bonus points for BIG Gin` + " )";
    }

	// ****
	
	if (g.layoff > 0 && g.who === "player" && g.winner === "player"
	    && g.type == "knock") {
	    bonusLine = `CPU Deadwood is ${cDW} = ` +
		`${g.originalDW} - ${g.layoff} layoff` + "\n";
	}
	if (g.layoff > 0 && g.who === "cpu" && g.winner === "cpu"
	    && g.type == "knock") {
	    bonusLine = `Player Deadwood is ${pDW} = ` +
		`${g.originalDW} - ${g.layoff} layoff` + "\n";
	}
	
	
	//	if (g.bonus.bonus === 0 && g.layoff === 0 ) {
	//	    bonusLine = "";
	//	} else {
	//	    bonusLine = `Bonus: ${g.bonus.bonus} ${g.bonus.type}   ` +
	//		`Layoffs: ${g.layoff} ` + "\n";
	//	}

	/* ... leave out for now!
	if (g.winner === "player") {
	    runningLine = `Running: ${g.accumulated.player} (${lastPlayer} + ${g.pointsThisGame})  vs  ${g.accumulated.cpu}`;
	} else {
	    runningLine = `Running: ${g.accumulated.player}  vs  ${g.accumulated.cpu} (${lastCpu} + ${g.pointsThisGame})`;
	}

	let calcLine = `${pDW} vs ${cDW} ➜ ${g.deadwood.diff}`;
	if (g.type === "gin" && g.winner === "player") {
	    calcLine = `${g.deadwood.cpu} + 25 points bonus for GIN`;
	}
	if (g.type === "gin" && g.winner === "cpu") {
	    calcLine = `${g.deadwood.player} + 25 points bonus for GIN`;
	}
	*/
	
	const personalWinner =
	  g.winner === "player"
	  ? "You win"
	  : g.winner === "cpu"
	  ? "CPU wins"
	  : g.winner; // or whatever default you want

	let gameOverText = "";
	// not sure what to add here yet!
//	if (matchScore.player >= matchScore.target ||
//	    matchScore.cpu >= matchScore.target ) {
//	    gameOverText = "  ** GAME OVER **"
//	}

	if (g.winner === "player") {
	    runningLine = `Running: ${g.accumulated.player} ` +
		`(${lastPlayer} + ${g.pointsThisGame})  vs  ${g.accumulated.cpu}`;
	} else {
	    runningLine = `Running: ${g.accumulated.player}  `
		+ `vs  ${g.accumulated.cpu} (${lastCpu} + ${g.pointsThisGame})`;
	}
	
	out += "_____"                 + "\n";
	out += `Round ${g.gameNumber}` + "\n";
//	out += `${gameOverText}`       + "\n";
        out += `${title}`              + "\n";
        out += `${yourDeadwoodLine}`   + "\n";
        out += `${cpuDeadwoodLine}`    + "\n";
        out += `${personalWinner} `;
	out += `${g.pointsThisGame} points ${pointsThisHandCalc} ` + "\n";
	out += runningLine + "\n";

	/* for now .... leave out
	let whatWho = `( ${g.type} by ${g.who} )`;
	if (g.type === "undercut") {
	    whatWho = `( ${g.type} against ${g.who} )`;
	}
	
	let whoWinsText = `${g.winner} won!`; // default
	if (g.winner === "player") whoWinsText = `You Won!`;

	out += `Round ${g.gameNumber}: ${whoWinsText}` + whatWho + "\n";

	out += `Your deadwood: ${g.deadwood.player}` + "\n";
	out += `CPU  deadwood: ${g.deadwood.cpu}` + "\n";
	
	//	out += `${g.deadwood.player} vs ${g.deadwood.cpu} ➜ ${g.deadwood.diff}` + "\n" ;
	out += calcLine + "\n" ;
	out += bonusLine;
	
	out += `${g.winner} wins ${g.pointsThisGame} points` + "\n";

	out += runningLine + "\n";
	//	out += `Running: ${g.accumulated.player}  vs  ${g.accumulated.cpu}`;
	
	out += "\n";
*/
	lastPlayer = g.accumulated.player;
	lastCpu    = g.accumulated.cpu;
	
    }); // for each
    
    showMessage(out);
}//scoreBoardDetails

// do not really use this anymore
function formatRow(desc, player, cpu) {
    const col1 = desc.padEnd(20, " ");
    const col2 = String(player).padStart(7, " ");
    const col3 = String(cpu).padStart(7, " ");
    return `${col1}${col2}${col3}\n`;
}



// this is for a pause function: await sleep(2000); // pause 2 seconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


makeModalDraggable(document.getElementById("modal-content"), 
                   document.getElementById("modal-header"));


makeModalResizable(document.getElementById("modal-content"),
                   document.getElementById("modal-resize"));

//const modal = document.getElementById("modal-content");
//const header = document.getElementById("modal-header");
//const resizeHandle = document.getElementById("modal-resize");
//
//makeModalDraggable(modal, header);
//makeModalResizable(modal, resizeHandle);


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

function makeModalResizable(modal, handle) {
    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;

    // Mouse
    handle.addEventListener("mousedown", startResizeMouse);
    // Touch
    handle.addEventListener("touchstart", startResizeTouch, { passive: false });

    function startResizeMouse(e) {
        e.preventDefault();
        beginResize(e.clientX, e.clientY);
        document.addEventListener("mousemove", resizeMouse);
        document.addEventListener("mouseup", stopResizeMouse);
    }

    function startResizeTouch(e) {
        e.preventDefault();
        const t = e.touches[0];
        beginResize(t.clientX, t.clientY);
        document.addEventListener("touchmove", resizeTouch, { passive: false });
        document.addEventListener("touchend", stopResizeTouch);
    }

    function beginResize(x, y) {
        startX = x;
        startY = y;
        startWidth = modal.offsetWidth;
        startHeight = modal.offsetHeight;
    }

    function resizeMouse(e) {
        doResize(e.clientX, e.clientY);
    }

    function resizeTouch(e) {
        e.preventDefault();
        const t = e.touches[0];
        doResize(t.clientX, t.clientY);
    }

    function doResize(x, y) {
        const dx = x - startX;
        const dy = y - startY;

        modal.style.width = startWidth + dx + "px";
        modal.style.height = startHeight + dy + "px";
    }

    function stopResizeMouse() {
        document.removeEventListener("mousemove", resizeMouse);
        document.removeEventListener("mouseup", stopResizeMouse);
    }

    function stopResizeTouch() {
        document.removeEventListener("touchmove", resizeTouch);
        document.removeEventListener("touchend", stopResizeTouch);
    }
}//makeModalResizable

// FROM PRE-utils

// Utils used in any file below.

function runValue(rank) {
  const map = { A:1, J:11, Q:12, K:13 };
  return map[rank] ?? Number(rank);
}
/*
function deadwoodValue(rank) {
  if (rank === "A") return 1;
  if (["J","Q","K"].includes(rank)) return 10;
  return Number(rank);
*/
function deadwoodValue(rank) {
  // Normalize numeric ranks to string for comparison
  const r = typeof rank === "number" ? rank : rank.toUpperCase();

  if (r === 1 || r === "A") return 1;
  if (r === 11 || r === "J") return 10;
  if (r === 12 || r === "Q") return 10;
  if (r === 13 || r === "K") return 10;

  return Number(r);
}

function logPrintCards(arr) {
  console.log(
    arr.map(c => `${c.rank}${c.suit} (run:${c.runValue}, dead:${c.deadwoodValue}, id:${c.id})`)
       .join("  ")
  );
}

function logPrintSet(set) {
  console.log(
    [...set].map(c => `${c.rank}${c.suit} (id:${c.id}, run:${c.runValue})`).join("  ")
  );
}


function consoleLogHand(hand,melds) {
    //    console.log(melds);
    //    console.log("-- evaluate -- ");
    //    console.log(  "\nHand: ", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
    console.log("\n"); 
    //    console.log(`Game Turn: ${game.turn}`);
    console.log(`Hand: ${hand.map((c,i) => `${i}) ${c.rank}${c.suit}`).join(" ")}`  );
console.log("" +  
    	    `Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );
console.log("VALUES:", hand.map(c => `${c.rank}:${c.runValue}`).join("  "));

console.log("MELDS:", JSON.stringify(melds));

}    

// for melds
function logBest(Desc, best) {
    if (!best) return;
    console.log( 
	`${Desc} : Best Pattern: ${best.pattern}\n` +
	    `Melds: ${JSON.stringify(best.melds)}\n` +
	    `Deadwood: ${JSON.stringify(best.deadwood)}`
    );
    
}
