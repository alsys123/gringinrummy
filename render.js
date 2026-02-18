
  /* ------------------------------
     Rendering
     ------------------------------ */

//__ render
function render() {
    el.cpu.innerHTML = "";

    // version 3
    const evalCpu    = evaluate(game.cpu);
    const cpuMeldCardIds = evalCpu.melds
	  .flat()
	  .map(i => game.cpu[i].id);
    const cpuMeldIds = new Set(cpuMeldCardIds);
    
    const sortedCpuFinal = sortHandWithMeldsFirstv2(game.cpu, evalCpu.melds);

//    console.log("after the sort");
//    consoleLogHand(sortedCpuFinal,evalCpu.melds);

    //    console.log("evalcpu:", evalCpu)
//    console.log("sortedCpu:",sortedCpuFinal);

    //
//    console.log("cpuMeldIds:",cpuMeldIds);
//    
//    const sortedCpuFinal = sortHandUsingMeldIds(sortedCpu, cpuMeldCardIds);
//    console.log("sortedCpuFinal:",sortedCpuFinal);
    
//    renderCPU(sortedCpuFinal, evalCpu, cpuMeldIds, el);
    renderCPU(sortedCpuFinal, evalCpu, cpuMeldIds, el);
    
// v1 and v2    renderCPU(sortedCpu,evalCpu,cpuMeldIds, el);


    
      // player cards rendering
      
      el.player.innerHTML = "";
    //      const sorted = sortHandByRank(game.player);


    // new one!

    const evalPlayer    = evaluate(game.player);
    const playerMeldCardIds = evalPlayer.melds
	  .flat()
	  .map(i => game.player[i].id);
    const meldIds = new Set(playerMeldCardIds);
    const sorted = sortHandWithMeldsFirstv2(game.player, evalPlayer.melds);
 
    
    //   comst sorted = sortHandUsingPattern(game.player, evalPlayer.melds);
      //    console.log("yes in render");
      //    console.log("game draw = ", game.drawn);
      
//    renderPlayer(sortedCpuFinal, evalCpu, cpuMeldIds, el);

    // Auto-scale BEFORE positioning cards
      autoScaleHand(el.player, sorted.length, 95, 95);

    let gapInserted = false;
//      gapInserted = false;
    let i= 0;

    // center the cards
//    const effectiveSpacing = 70 * scale; // adjust for overlap
//    const totalWidth = (sorted.length - 1) * effectiveSpacing;
//    const offset = (window.innerWidth - totalWidth) / 2;
      const offset = 100; // move entire hand right

    const PLAYER_SHIFT_X = -00;   // move left
    const PLAYER_SHIFT_Y = 20;      // move up/down

      for (const c of sorted) {
	  const isMeld = meldIds.has(c.id);

	  // *** Fan parameters  ***
	  const total = sorted.length;
	  const center = (total - 1) / 2;
	  // Curve amount (vertical arc)
	  const curveStrength = 30;   // higher = more curve
	  // Rotation amount
	  const maxAngle = 12;        // degrees at far edges
	  // Compute relative index from center
	  const rel = i - center;
	  // Vertical curve (parabolic)
	  const yOffset = - (curveStrength * (1 - Math.pow(rel / center, 2))); 
	  // Middle goes up, edges go down
	  // Rotation
	  const angle = (rel / center) * maxAngle;
	  
	  // for scalling the spaces
	  let scale = 1;
	  if (el.player.classList.contains("normal")) scale = 1;
	  if (el.player.classList.contains("small")) scale = 0.8;
	  if (el.player.classList.contains("smaller")) scale = 0.65;
	  if (el.player.classList.contains("tiny")) scale = 0.5;
	  
//	  const effectiveSpacing = 95 * scale;
	  const effectiveSpacing = 70 * scale;  // size of overlap
	  const totalWidth = (sorted.length - 1) * effectiveSpacing;
	  // get actual card width from CSS
//	  const cardWidth = parseFloat(getComputedStyle(document.documentElement) .getPropertyValue("--card-width"));
	  // corrected centering
//	  const offset = (window.innerWidth - totalWidth) / 2 - cardWidth / 2;
	  const offset = ((window.innerWidth - totalWidth) / 2 ) - 100;

	  
	  // Insert gap before the first non-meld card
	  if (!isMeld && !gapInserted) {
              const gap = document.createElement("div");
              gap.className = "meld-gap";
	      
	      // new gap
	      gap.style.position = "absolute";
//	      gap.style.left = `${offset + i * 75}px`;
	      gap.style.left = `${offset + i * effectiveSpacing}px`;

	      gap.style.top = "400px";
	      //
	
              el.player.appendChild(gap);
	      
	      i++; // gap takes a spot
	      
              gapInserted = true;
	  } // if: !isMeld && !gapInserted
	  
	  const f = cardFace(c);
	  if (isMeld) f.classList.add("meld-card");
	  // REQUIRED — without this, cards do not appear
	  f.style.position = "absolute";
	  
	  //    f.style.left = `${offset + i * 95}px`;
//	  f.style.left = `${offset + i * effectiveSpacing}px`;
	  f.style.left = `${offset + PLAYER_SHIFT_X + i * effectiveSpacing}px`;

	  //    f.style.left = `${i * 75}px`;
//	  f.style.top = "400px";
//	 f.style.top = `${400 + yOffset}px`;  // for the curve
	  f.style.top = `${400 + PLAYER_SHIFT_Y + yOffset}px`;

	  // Rotation
	  f.style.transform = `rotate(${angle}deg)`;
	  f.style.transformOrigin = "50% 80%";
	  
	  f.onclick = () => playerDiscard(c.id);
//	  el.player.appendChild(f);
      
	  if (game.drawn === c.id || game.drawn?.id === c.id) {
              f.classList.add("just-drawn");
	      
	  }
	  
	  
	  i++;

	  // open backdoor
	  f.ondblclick = () => openCloseBackDoor();

	  // append ONCE
	  el.player.appendChild(f);

//	  el.player.appendChild(f);

      } // for sorted - the player
      
      

      // ====== display deadwook count ======
    el.deadwood.textContent = "Deadwood: " + evalPlayer.deadwood;

//    el.stockCount.textContent = "(" + game.stock.length + ")";

    if (game.discard.length) {
      const top = game.discard[game.discard.length-1];
      const f = cardFace(top);
      el.discard.innerHTML = "";
	el.discard.className = "card";
//	el.discard.className = "card discard-animate"; // ⭐ add animation class
	el.discard.appendChild(f);
//	  setTimeout(() => el.discard.classList.remove("discard-animate"), 200);
    } else {
      el.discard.className = "card back";
      el.discard.innerHTML = "<span>EMPTY</span>";
    }

//    showMessage("update buttons in render");
    
     updateButtons();
  } // render


// -- part of render
// -- area:  866 .  Needed:  680 == normal
function autoScaleHand(container, handLength, cardWidth, spacing) {
// -- future    const table = document.getElementById("game"); // or your main game container
// was...!!!    const table = document.getElementById("table"); // or your main game container
    const table = document.getElementById("game"); // or your main game container
    const areaWidth = table.clientWidth;            // <-- REAL width

    const neededWidth = (handLength - 1) * spacing + cardWidth;

    container.classList.remove("normal", "small", "smaller", "tiny");

    if (neededWidth <= areaWidth) {
        container.classList.add("normal");
        return;
    }

    if (neededWidth * 0.9 <= areaWidth) {
        container.classList.add("small");
        return;
    }

    if (neededWidth * 0.75 <= areaWidth) {
        container.classList.add("smaller");
        return;
    }

    container.classList.add("tiny");
}


// make global
//window.autoScaleHand = autoScaleHand;

function cardBack() {
  const div = document.createElement("div");
  div.className = "card back";
  div.textContent = ""; // or "CPU" or leave empty
  return div;
}


// --- new renderCPU

function computeCpuSlots() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const SLOTS = 11;            // 10 cards + 1 gap
    const SPACING = 25;          // horizontal spacing
    const ANGLE_STEP = 2.5;      // degrees per card
    const fanWidth = SLOTS * SPACING; // 250px
    
    const rightMargin = w * 0.10;   // 0.05=5% from right edge
    const topMargin   = h * 0.17;   // 0.05=5% from top

    const LEFT_SHIFT = fanWidth * 1; // shift left by half the fan
    
    const rightmostX = w - rightMargin - LEFT_SHIFT;

    // ⭐ Add your CPU hand shift here
    const CPU_SHIFT_X = -60;   // negative = move left, positive = move right
    const CPU_SHIFT_Y = -100;     // adjust if you want to move up/down

    const slots = [];

    for (let i = 0; i < SLOTS; i++) {
	const angle = -((i - (SLOTS - 1) / 2) * ANGLE_STEP);
	//	const x = rightmostX + i * SPACING;
	const x = rightmostX + i * SPACING + CPU_SHIFT_X;
	const top = topMargin + CPU_SHIFT_Y;
//        slots.push({ x, angle, top: topMargin });
        slots.push({ x, angle, top: top });
    }

    return slots;
} //computeCpuSlots


function placeCpuItem(type, card, slot, container) {
    const div = document.createElement("div");

    if (type === "gap") {
        div.className = "meld-gap";
    } else {
        div.className = game.revealCpu ? "card" : "card back";

        if (game.revealCpu) {
            const face = cardFace(card);
            face.style.position = "absolute";
            face.style.left = "0px";
            face.style.top = "0px";

	    face.classList.add("cpu-card"); // new to show layoff
	    
            div.appendChild(face);
        }
    }

    div.style.position = "absolute";
    div.style.left = slot.x + "px";
    div.style.top = slot.top + "px";
    div.style.transformOrigin = "50% 50%";
    
    div.style.transform = `rotate(${slot.angle}deg)`;

    container.appendChild(div);
} //placeCpuItem

function splitCpuCards(sortedCpu, cpuMeldIds) {
    const melds = [];
    const nonMelds = [];

    for (const card of sortedCpu) {
        if (cpuMeldIds.has(card.id)) {
            melds.push(card);
        } else {
            nonMelds.push(card);
        }
    }

    return { melds, nonMelds };
}//splitCpuCards

function renderCPU(sortedCpu, evalCpu, cpuMeldIds, el) {
    el.cpu.innerHTML = ""; // clear previous render

    const slots = computeCpuSlots();
    const { melds, nonMelds } = splitCpuCards(sortedCpu, cpuMeldIds);

    let slotIndex = 0;

    // 1. Render meld cards (left side)
    for (const card of melds) {
        placeCpuItem("card", card, slots[slotIndex], el.cpu);
        slotIndex++;
    }

    // 2. Insert gap (only if CPU cards are revealed)
    if (game.revealCpu) {
        placeCpuItem("gap", null, slots[slotIndex], el.cpu);
        slotIndex++;
    }

    // 3. Render non-meld cards (right side)
    for (const card of nonMelds) {
        placeCpuItem("card", card, slots[slotIndex], el.cpu);
        slotIndex++;
    }

    /// for DEBUG ONLY
    ///logCpuFanBounds(el);
    

} //renderCPU

/// for DEBUG ONLY
function logCpuFanBounds(el) {
    const cards = Array.from(el.cpu.children);

    let minLeft = Infinity;
    let maxRight = -Infinity;
    let minTop = Infinity;
    let maxBottom = -Infinity;

    for (const c of cards) {
        const r = c.getBoundingClientRect();
        minLeft = Math.min(minLeft, r.left);
        maxRight = Math.max(maxRight, r.right);
        minTop = Math.min(minTop, r.top);
        maxBottom = Math.max(maxBottom, r.bottom);
    }

    const bounds = {
        left: Math.round(minLeft),
        right: Math.round(maxRight),
        top: Math.round(minTop),
        bottom: Math.round(maxBottom),
        width: Math.round(maxRight - minLeft),
        height: Math.round(maxBottom - minTop)
    };

    console.log("CPU fan bounds:", bounds);

    /*
    // fix the right-hand side
    const rect = el.cpu.getBoundingClientRect();
    const overflow = bounds.right - window.innerWidth;
    
    if (overflow > 0) {
	el.cpu.style.transform = `translateX(-${overflow}px)`;
    }
    */
    
}




/* NOTES on moving content:

   a)    Main Title:

   b)   ScoreBoard: use style.css
      .scoreboard
      transform: translateX(-40px)
      
      c)  btn-new  use style.css
          btn-knock
	  btn-gin
	  --> left: 90%;
	      top:  40%;

	      d) cpu cards -- use render.js
	      computeCpuSlots function
        // ⭐ Add your CPU hand shift here
    const CPU_SHIFT_X = -60;   // negative = move left, positive = move right
    const CPU_SHIFT_Y = -100;     // adjust if you want to move up/down

    e) player cards .. in render.js
    render():
    
    const PLAYER_SHIFT_X = -50;   // move left
    const PLAYER_SHIFT_Y = 10;    

    f) middle card stack . om style.css
    #center-area ...
    margin-left: -175px; 
  

    g) deadwood diplay .. in style.css

  #deadwood-info ...
    margin-left: -175px; 
  
   */
