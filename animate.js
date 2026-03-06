/* ------------------------------
   Animate
   ------------------------------ */

//
async function animateCpuTakeFromStock(card) {
  const stockElem = el.stock;
  const cpuHandElem = el.cpu;

  const start = stockElem.getBoundingClientRect();
  const end = cpuHandElem.getBoundingClientRect();

  const flying = cardBack();
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.opacity = "1";

  // 1. Append to DOM first
  document.body.appendChild(flying);

  // 2. Force layout flush
  void flying.offsetWidth;

  // 3. Initial transform
  flying.style.transform = "translate(0px, 0px) rotate(0deg)";

  // 4. Animate transform AND opacity
  flying.style.transition =
    "transform 3000ms ease-in-out, opacity 6000ms ease-in-out";

  // 5. Next frame → animate to CPU area + fade out
  requestAnimationFrame(() => {
    const dx = (end.left + 700) - start.left;
    const dy = (end.top - 300) - start.top; // was -200

    flying.style.transform = `translate(${dx}px, ${dy}px) rotate(-10deg)`;
    flying.style.opacity = "0";   // fade out
  });

  flying.addEventListener("transitionend", () => flying.remove(), { once: true });
}//animateCpuTakeFromStock

//_animateCpuTakeFromDiscard
async function animateCpuTakeFromDiscard(card) {
  const discardElem = el.discard;
  const cpuHandElem = el.cpu;

  const start = discardElem.getBoundingClientRect();
  const end = cpuHandElem.getBoundingClientRect();

  const flying = cardFace(card);   // starts as the face
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.opacity = "1";
  flying.style.backfaceVisibility = "hidden";

  // 1. Append to DOM FIRST
  document.body.appendChild(flying);

  // 2. Force layout flush
  void flying.offsetWidth;

  // 3. Initial transform
  flying.style.transform = "translate(0px, 0px) rotate(0deg) rotateY(0deg)";

  // 4. Animate transform + opacity
  flying.style.transition =
    "transform 3000ms ease-in-out, opacity 800ms ease-in-out";

  // 5. Next frame → animate toward CPU
  requestAnimationFrame(() => {
    const dx = (end.left + 800) - start.left; // was 600
    const dy = (end.top - 300) - start.top;   // was 300

    flying.style.transform =
      `translate(${dx}px, ${dy}px) rotate(-10deg) rotateY(0deg)`;
  });

  // 6. Halfway through → flip + swap to back
  setTimeout(() => {
    // flip
    flying.style.transform += " rotateY(180deg)";

    // swap to back AFTER the flip begins
    setTimeout(() => {
      const back = cardBack();
      flying.innerHTML = back.innerHTML;
    }, 100); // small delay so swap happens during the flip was 300
  }, 100); // halfway through 3000ms was 750

  // 7. Fade out near the end
  setTimeout(() => {
    flying.style.opacity = "0";
  }, 1000); // was 2000

  flying.addEventListener("transitionend", () => flying.remove());
}//animateCpuTakeFromDiscard

//__cpuDiscardAnimate
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
    hover.style.transition = "all .6s ease"; // ⭐ smooth animation

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
    hover.style.left = (rect.left + 40) + "px";  // was +40
    hover.style.top = (rect.top - 40) + "px"; // hover 40px above - was -40

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
	// does not seem to make a difference
	// this is how long to hover for
	const MOVE_TIME = 0.50; // seconds — make this bigger to slow it down was 0.50

	//opacity 2s … → fade‑in takes 2 seconds
	//top 2s … → vertical movement takes 2 seconds
	//left 2s … → horizontal movement takes 2 seconds
	hover.style.transition =
	    "opacity 2s cubic-bezier(0.16, 1, 0.3, 1), " +
	    "top 2s cubic-bezier(0.16, 1, 0.3, 1), " +
	    "left 2s cubic-bezier(0.16, 1, 0.3, 1)"; 
	hover.style.opacity = "1"; // was 0
	hover.style.left = (rect.left - 1) + "px";  //was -1
	hover.style.top = (rect.top + 0) + "px"; // drop 10px - was +10

//	hover.style.transition = "opacity 0.4s ease";
//	hover.style.opacity = "0";
	// Remove after fade
	setTimeout(() => hover.remove(), (MOVE_TIME * 1000) + 50); //was 1300

    }, 100);  // delay start by 1000 second -- AA
}//cpuDiscardAnimate

function showMessageBubble(text) {
    const bubble = document.getElementById("message-bubble");
    const stock = document.getElementById("stock");

    if (!bubble || !stock) return;

    // Set the text dynamically
    bubble.textContent = text;

    // Position bubble near stock card
    const rect = stock.getBoundingClientRect();
    bubble.style.left = rect.left + window.scrollX - 40 + "px";
    bubble.style.top  = rect.top  + window.scrollY - 0 + "px"; // was -120

    let count = 0;

    function flash() {
	bubble.style.display = "block";
	bubble.style.opacity = 0;
	bubble.style.transform = "scale(0.5)";

	requestAnimationFrame(() => {
	    bubble.style.opacity = 1;
	    bubble.style.transform = "scale(1)";
	});

	setTimeout(() => {
	    bubble.style.opacity = 0;
	    bubble.style.transform = "scale(0.5)";
	}, 2000);

/*	
	setTimeout(() => {
	    bubble.style.display = "none";
	    count++;
	    if (count < 3) setTimeout(flash, 300);
	    }, 600);
*/
	
    }//flash

    flash();

}//showMessageBubble


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

function celebrateMatchWin() {
    const field = document.getElementById("star-field");

    // spawn 40–60 stars
    for (let i = 0; i < 2500; i++) {  // was 50
        const star = document.createElement("div");
        star.className = "starflash";

        // random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        star.style.left = x + "px";
        star.style.top = y + "px";

        // random size variation
        const size = 6 + Math.random() * 10;
        star.style.width = size + "px";
        star.style.height = size + "px";

        // random delay so they don't all flash at once
        star.style.animationDelay = (Math.random() * 5.0) + "s"; // was 0.6

	// multi-color
// multi-color glow palettes
const glows = [
    ["#FFD700", "#FFEA00", "#FFFACD"], // gold
    ["#FF69B4", "#FF1493", "#FFC0CB"], // pink
    ["#87CEFA", "#00BFFF", "#E0FFFF"], // blue
    ["#7CFC00", "#32CD32", "#CCFFCC"], // green
    ["#FFA500", "#FF8C00", "#FFE5B4"], // orange
    ["#FF4444", "#FF0000", "#FFB3B3"]  // red
];

// pick a random palette
const g = glows[Math.floor(Math.random() * glows.length)];

// apply background + glow
star.style.background = g[0];
star.style.boxShadow = `
    0 0 6px ${g[0]},
    0 0 10px ${g[1]},
    0 0 14px ${g[2]}
`;

	
        field.appendChild(star);

        // remove after animation
        setTimeout(() => star.remove(), 15000);
    }
}//celebrateMatchWin

