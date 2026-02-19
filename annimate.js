function animateCpuTakeFromStock(card) {
    const stockElem = el.stock;     // your stock pile element
  const cpuHandElem = el.cpu;     // your CPU hand container

  const start = stockElem.getBoundingClientRect();
  const end = cpuHandElem.getBoundingClientRect();

//    const flying = cardFace(card);
    const flying = cardBack();

  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.transition = "all 400ms ease-out";

  document.body.appendChild(flying);

  // Move up and right (or however you want)
  requestAnimationFrame(() => {
    flying.style.left = start.left + 500 + "px";  // right
    flying.style.top = start.top - 200 + "px";    // up
    flying.style.transform = "rotate(-10deg)";
  });

  flying.addEventListener("transitionend", () => {
    flying.remove();
  }, { once: true });
} // animateCpuTakeFromStock


function animateCpuTakeFromDiscard(card) {
  const discardElem = el.discard;
  const cpuHandElem = el.cpu;

  const start = discardElem.getBoundingClientRect();
  const end = cpuHandElem.getBoundingClientRect();

  //  console.log("start and end: ", start, "and end: ", end );

    
  const flying = cardFace(card); // your existing card renderer
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
//  flying.style.transition = "all 250ms ease-out";
  flying.style.transition = "all 600ms ease-out";

//    console.log("start here: left:", flying.style.left, " top: ",flying.style.top);
//    console.log("start left -- start:", start.left, " end: ",end.left);
    
  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    flying.style.left = end.left + 600 + "px";
    flying.style.top = end.top - 100 + "px";
    flying.style.transform = "rotate(-10deg)";
  });

  flying.addEventListener("transitionend", () => {
    flying.remove();
  });
} //animateCpuTakeFromDiscard


function animateCpuToDiscard( card ) {

    const discardElem = el.discard;
    const cpuHandElem = el.cpu;
    
    const end = discardElem.getBoundingClientRect();
    const start = cpuHandElem.getBoundingClientRect();

    const flying = cardFace(card); // your existing card renderer
    flying.style.position = "fixed";
    flying.style.left = start.left + 700 + "px";
  flying.style.top = start.top - 100 + "px";
    flying.style.zIndex = 9999;
  flying.style.transition = "all 100ms ease-out";

    document.body.appendChild(flying);
    
    requestAnimationFrame(() => {
	flying.style.left = end.left - 20 + "px";
	flying.style.top = end.top + 50 + "px";
	flying.style.transform = "rotate(-20deg)";
    });
    
    flying.addEventListener("transitionend", () => {
	flying.remove();
    }, { });
    
} //animateCpuToDiscard


async function cpuDiscardAnimate(card) {

    const pile = document.getElementById("discard-top");

    if (!pile) {
        console.warn("discard-top not found");
        return;
    }

    // Create a temporary hover card
    const hover = document.createElement("div");
    hover.className = "card";   // face-up card
    hover.style.position = "absolute";
//    hover.style.transition = "all .6s ease"; // ⭐ smooth animation

//    hover.style.transition = "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
    hover.style.transform = "translateY(-12px) scale(0.97)"; // subtle lift
    hover.style.transition = "opacity 0.45s ease-out, transform 0.45s ease-out"; 

    hover.style.opacity = "0"; // ⭐ start invisible
    
    // Insert the face image
    const face = cardFace(card);
    face.style.position = "absolute";
    face.style.left = "0px";
    face.style.top = "0px";
    hover.appendChild(face);

    // Position it above the discard pile
    const rect = pile.getBoundingClientRect();
//    hover.style.left = rect.left + "px";
    hover.style.left = (rect.left + 40) + "px";
    hover.style.top = (rect.top - 40) + "px"; // hover 40px above

    document.body.appendChild(hover);
   
    // ⭐ Two-frame trick — REQUIRED for smooth fade-in
    requestAnimationFrame(() => {
	requestAnimationFrame(() => {
	    hover.style.opacity = "1";
	    hover.style.transform = "translateY(0px) scale(1)";
	});
    });
    
    // Wait 3 seconds, then finalize discard
    setTimeout(() => {
//	hover.style.transition = "opacity 0.4s ease, top 0.4s ease";
	//	hover.style.transition = "opacity 1s ease";
	// ⭐ Slow, smooth movement (adjust this number)
	const MOVE_TIME = 4.0; // seconds — make this bigger to slow it down 

	hover.style.transition =
	    "opacity 2s cubic-bezier(0.16, 1, 0.3, 1), " +
	    "top 2s cubic-bezier(0.16, 1, 0.3, 1), " +
	    "left 2s cubic-bezier(0.16, 1, 0.3, 1)"; 
	hover.style.opacity = "0";
	hover.style.top = (rect.top + 10) + "px"; // drop 10px
	hover.style.left = (rect.left - 1) + "px";

//	hover.style.transition = "opacity 0.4s ease";
//	hover.style.opacity = "0";
	// Remove after fade
	setTimeout(() => hover.remove(), MOVE_TIME * 1000 + 50); //was 1300

    }, 1000);
}//cpuDiscard



// move the player card up a little to show it was used in a layoff
function markPlayerLayoffCards(layoffCards) {
    const layoffIds = new Set(layoffCards.map(c => c.id));
    
    const playerHandDiv = document.getElementById("player-hand");
    const cardDivs      = playerHandDiv.querySelectorAll(".player-card");
    
    for (const div of cardDivs) {
	const cardId = div.dataset.id;
	//    console.log("Checking card:", cardId, "Layoff?", layoffIds.has(cardId));
	
	if (layoffIds.has(cardId)) {
	    //      console.log("ADDING CLASS to", cardId);
	    div.classList.add("layoff-used");
	    
//	    console.log("Computed transform:", getComputedStyle(div).transform);
	    
	}
    }
    
} //markPlayerLayoffCards

/*
//markCPULayoffCards
function markCPULayoffCards(layoffCards) {
    console.log("in mark: ", layoffCards);
    
    const layoffIds = new Set(layoffCards.map(c => c.id));

    const cpuHandDiv = document.getElementById("cpu-hand");
    const cardDivs   = cpuHandDiv.querySelectorAll(".cpu-card");

    for (const div of cardDivs) {
        const cardId = div.dataset.id;

        if (layoffIds.has(cardId)) {
            div.classList.add("layoff-used-cpu");

            console.log(
                "CPU card transform:",
                getComputedStyle(div).transform

            );
        }
    }
    } //markCPULayoffCards
*/

function markCPULayoffCards(layoffCards) {
    const layoffIds = new Set(layoffCards.map(c => c.id));

    const cpuHandDiv = document.getElementById("cpu-hand");
    const outerCards = cpuHandDiv.querySelectorAll(".card");

    for (const outer of outerCards) {
        const face = outer.querySelector(".player-card"); // inner cardFace
        if (!face) continue;

        const cardId = face.dataset.id;

        if (layoffIds.has(cardId)) {
            // Store original top so we can offset from it
            outer.style.setProperty("--cpu-card-top", outer.style.top);
            outer.classList.add("layoff-used-cpu");
        }
    }
}
