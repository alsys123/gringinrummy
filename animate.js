/* ------------------------------
   Animate
   ------------------------------ */
async function animateCpuTakeFromStock_shrink_v2(card) {
  const stockElem = el.stock;
  const start = stockElem.getBoundingClientRect();

  const flying = cardBack();
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.opacity = "1";
  flying.style.transformOrigin = "center center";

  document.body.appendChild(flying);
  void flying.offsetWidth;

  // Step 1: tiny lift + slight rotate (makes the shrink more readable)
  flying.style.transition = "transform 200ms ease-out";
  flying.style.transform = "translateY(-2px) rotate(-5deg)";

  // Step 2: visible shrink + fade
  setTimeout(() => {
    flying.style.transition = "transform 180ms ease-in, opacity 180ms ease-in";
    flying.style.transform = "translateY(-2px) scale(0.75) rotate(0deg)";
    flying.style.opacity = "0";
  }, 130);

  flying.addEventListener("transitionend", () => flying.remove(), { once: true });
}

async function animateCpuTakeFromStock_shrink(card) {
  const stockElem = el.stock;
  const start = stockElem.getBoundingClientRect();

  const flying = cardBack();
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.opacity = "1";
  flying.style.transformOrigin = "center center";

  document.body.appendChild(flying);
  void flying.offsetWidth;

  flying.style.transition = "transform 120ms ease-out, opacity 120ms ease-out";
  flying.style.transform = "scale(0.85)";
  flying.style.opacity = "0";

  flying.addEventListener("transitionend", () => flying.remove(), { once: true });
}

async function animateCpuTakeFromStock_micro(card) {
  const stockElem = el.stock;
  const start = stockElem.getBoundingClientRect();

  const flying = cardBack();
  flying.style.position = "fixed";
  flying.style.left = start.left + "px";
  flying.style.top = start.top + "px";
  flying.style.zIndex = 9999;
  flying.style.opacity = "1";
  flying.style.transformOrigin = "center center";

  document.body.appendChild(flying);
  void flying.offsetWidth;

  // micro-lift
  flying.style.transition = "transform 120ms ease-out";
  flying.style.transform = "translateY(-8px) rotate(-2deg)";

  // snap-disappear
  setTimeout(() => {
    flying.style.transition = "transform 100ms ease-in, opacity 100ms ease-in";
    flying.style.transform = "translateY(-4px) scale(0.6) rotate(0deg)";
    flying.style.opacity = "0";
  }, 130);

  flying.addEventListener("transitionend", () => flying.remove(), { once: true });
}


//
async function animateCpuTakeFromStock_v1(card) {
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
}//animateCpuTakeFromStock_v1

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
    "transform 1500ms ease-in-out, opacity 800ms ease-in-out"; //was 3000ms -- 800ms

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
	}, 4000); // was 2000

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



  // working copy
async function celebrateMatchWin() {

    // do something different for ipad
    const isIpad = navigator.userAgent.includes("iPad") ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    if (isIpad) {
	celebrateMatchWin_iPad_starburstLoop();
        return;
    }
    
    /// for testing
//   celebrateMatchWin_iPad_starburstLoop();
//    return;
    
    const field = document.getElementById("star-field");

    // spawn 40–60 stars
    for (let i = 0; i < 1500; i++) {  // was 50 .. try 300
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
//star.style.background = `radial-gradient(circle, ${g[0]} 0%, transparent 70%)`; //.. ipad?

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
    
/*
function celebrateMatchWin_iPad() {

    const region = document.getElementById("star-ipad-region");

    // region size (200×200px)
    const regionW = 500;
    const regionH = 500;

    // center region
    region.style.width = regionW + "px";
    region.style.height = regionH + "px";
    region.style.left = (window.innerWidth - regionW) / 2 + "px";
    region.style.top = (window.innerHeight - regionH) / 2 + "px";
//    star.style.animationDelay = (Math.random() * 4.0) + "s";

    // color palettes (same as desktop)
    const glows = [
        ["#FFD700", "#FFEA00", "#FFFACD"],
        ["#FF69B4", "#FF1493", "#FFC0CB"],
        ["#87CEFA", "#00BFFF", "#E0FFFF"],
        ["#7CFC00", "#32CD32", "#CCFFCC"],
        ["#FFA500", "#FF8C00", "#FFE5B4"],
        ["#FF4444", "#FF0000", "#FFB3B3"]
    ];

    for (let i = 0; i < 40; i++) {

        const star = document.createElement("div");
        star.className = "starflash-ipad";

        // random point inside region
        const x = Math.random() * regionW;
        const y = Math.random() * regionH;

        star.style.left = x + "px";
        star.style.top = y + "px";

        // random size
        const size = 14 + Math.random() * 26;
        star.style.width = size + "px";
        star.style.height = size + "px";

        // random color
        const g = glows[Math.floor(Math.random() * glows.length)];

        // iPad-safe glow using radial-gradient (no box-shadow)
        star.style.background = `radial-gradient(circle, ${g[0]} 0%, transparent 130%)`;
	star.style.animationDelay = (Math.random() * 3) + "s";

        region.appendChild(star);

        // cleanup
        setTimeout(() => star.remove(), 10000);
    }
}//celebrateMatchWin_iPad


function celebrateMatchWin_iPad_starburst() {
    injectIpadStarburstCSS();

    const region = document.getElementById("star-ipad-region");

    const regionW = 250;
    const regionH = 250;

    region.style.width = regionW + "px";
    region.style.height = regionH + "px";
    region.style.left = (window.innerWidth - regionW) / 2 + "px";
    region.style.top = (window.innerHeight - regionH) / 2 + "px";

    const glows = [
        ["#FFD700", "#FFEA00"],
        ["#FF69B4", "#FFC0CB"],
        ["#87CEFA", "#E0FFFF"],
        ["#7CFC00", "#CCFFCC"],
        ["#FFA500", "#FFE5B4"],
        ["#FF4444", "#FFB3B3"]
    ];

    for (let i = 0; i < 40; i++) {

        const star = document.createElement("div");
        star.className = "starburst-ipad";

        // center of region
        const cx = regionW / 2;
        const cy = regionH / 2;

        star.style.left = cx + "px";
        star.style.top = cy + "px";

        // bigger stars
        const size = 12 + Math.random() * 20;
        star.style.width = size + "px";
        star.style.height = size + "px";

        // random glow color
        const g = glows[Math.floor(Math.random() * glows.length)];
        star.style.background = `radial-gradient(circle, ${g[0]} 0%, transparent 90%)`;

        // random outward direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 120; // how far it travels

        const dx = Math.cos(angle) * distance + "px";
        const dy = Math.sin(angle) * distance + "px";

        star.style.setProperty("--dx", dx);
        star.style.setProperty("--dy", dy);

        // optional delay for richer burst
        star.style.animationDelay = (Math.random() * 0.8) + "s";

        region.appendChild(star);

        // remove after animation
        setTimeout(() => star.remove(), 3500);
    }
	
	document.getElementById("ipad-starburst-style")?.remove();

}
*/
/*
//ipad
async function celebrateMatchWin() {

    const region = document.getElementById("star-center-region");

    const regionW = 200;
    const regionH = 200;

    region.style.width = regionW + "px";
    region.style.height = regionH + "px";
    region.style.left = (window.innerWidth - regionW) / 2 + "px";
    region.style.top = (window.innerHeight - regionH) / 2 + "px";

    for (let i = 0; i < 25; i++) {

        const star = document.createElement("div");
        star.className = "starflash";

        // random point INSIDE region
        const x = Math.random() * regionW;
        const y = Math.random() * regionH;

        star.style.left = x + "px";
        star.style.top = y + "px";

        const size = 6 + Math.random() * 10;
        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.animationDelay = (Math.random() * 5.0) + "s";

        const glows = [
            ["#FFD700", "#FFEA00", "#FFFACD"],
            ["#FF69B4", "#FF1493", "#FFC0CB"],
            ["#87CEFA", "#00BFFF", "#E0FFFF"],
            ["#7CFC00", "#32CD32", "#CCFFCC"],
            ["#FFA500", "#FF8C00", "#FFE5B4"],
            ["#FF4444", "#FF0000", "#FFB3B3"]
        ];

        const g = glows[Math.floor(Math.random() * glows.length)];

        star.style.background = g[0];
        star.style.boxShadow = `
            0 0 6px ${g[0]},
            0 0 10px ${g[1]},
            0 0 14px ${g[2]}
        `;

        region.appendChild(star);

        setTimeout(() => star.remove(), 15000);
    }
}
*/
