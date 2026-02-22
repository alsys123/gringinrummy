



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
	let whatWho = `( ${g.type} by ${g.who} )`;
	if (g.type === "undercut") {
	    whatWho = `( ${g.type} against ${g.who} )`;
	}
	out += `Game ${g.gameNumber}: ${g.winner.toUpperCase()} wins! ` +
	    whatWho + "\n";
	
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
