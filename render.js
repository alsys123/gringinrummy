
  /* ------------------------------
     Rendering
  ------------------------------ */
function renderCPU(sortedCpu,evalCpu,cpuMeldIds, el) {

//       console.log("\nRender CPU: ");
//    console.log("sortedCpu:", sortedCpu.map((c, i) => `${i}:${c.rank}${c.suit}`).join("  "));
//        console.log("evalCpu:", evalCpu.map((c, i) => `${i}:${c.rank}${c.suit}`).join("  "));
//    console.log(
//	`evalCpu = { deadwood:${evalCpu.deadwood}, melds:${evalCpu.melds
//    .map(m => `[${m.join(",")}]`)
//    .join(" ")} }`
//    );
    
//    console.log("cpuMeldIds:", JSON.stringify(cpuMeldIds));
//    console.log("=> cpuMeldIds:", Array.from(cpuMeldIds));

    let gapInserted = false;
    let visualIndex = 0;
    
// ??? why with player      const sorted = sortHandWithMeldsFirst(game.player);

	
    // ----- the CPU cards -----
    for (let i = 0; i < sortedCpu.length; i++) {
	const card = sortedCpu[i];

	const isMeld = cpuMeldIds.has(card.id);
	//const isMeld = cpuMeldIds.has(i);
//	  const isMeld = meldIds.has(c.id);

	// ⭐ Insert gap before first non-meld card
	if (!isMeld && !gapInserted && game.revealCpu) {
            const gap = document.createElement("div");
            gap.className = "meld-gap";
	    
            // Position gap in CPU fan
// orig            const count = sortedCpu.length;
            const count = sortedCpu.length +1;
	    
//orig            const angle = (i - (count - 1) / 2) * 2.5;
	     const angle = (visualIndex - (count - 1) / 2) * 2.5;

	    const x = 700 + visualIndex * 25; // new
	    
// orig           const baseOffset = 700;
// orig           const overlap = 6;
// orig           const x = baseOffset + i * overlap;
	    
            gap.style.position = "absolute";
            gap.style.left = x + "px";
            gap.style.top = "0px";
            gap.style.transform = `rotate(${angle}deg)`;
	    
            el.cpu.appendChild(gap);
            gapInserted = true;
	    visualIndex++; // gap consumes a visual slot
	    
//	    i++; //gap takes a spot

	} // if: !isMeld && !gapInserted
	
	// ⭐ Now render the CPU card (face-up or back)
	const b = document.createElement("div");

//	console.log("show cpu pre!",game.revealCpu);
	
	if (game.revealCpu) {

//	    console.log("show cpu!");
	    
            const face = cardFace(card);
            face.style.position = "absolute";
            face.style.left = "0px";
            face.style.top = "0px";
            b.appendChild(face);
            b.className = "card";
	} else {
            b.className = "card back";
	}
	
	//orig	const count = sortedCpu.length;
	const count = sortedCpu.length + (gapInserted ? 1 : 0);	
	
	//orig	const angle = (i - (count - 1) / 2) * 2.5;
	const angle = (visualIndex - (count - 1) / 2) * 2.5;
	const x = 700 + visualIndex * 25;
	
//	const baseOffset = 700;
//	const overlap = 25;
//	const x = baseOffset + i * overlap;
	
	b.style.position = "absolute";
	b.style.left = x + "px";
	b.style.top = "0px";
	b.style.transform = `rotate(${angle}deg)`;
	
	el.cpu.appendChild(b);
	visualIndex++; // ← REQUIRED
    } // for sortedCPU
    
} // renderCPU

//__ render
function render() {
    el.cpu.innerHTML = "";
    
    const sortedCpu = sortHandWithMeldsFirst(game.cpu);
    const evalCpu = evaluate(sortedCpu);
    const cpuMeldIds = meldCardIds(sortedCpu, evalCpu);
    // sortHandUsingPattern(game.cpu, evalCpu.melds)
	
    renderCPU(sortedCpu,evalCpu,cpuMeldIds, el);

    let gapInserted = false;

    
      // player cards rendering
      
      el.player.innerHTML = "";
      //      const sorted = sortHandByRank(game.player);
      const sorted = sortHandWithMeldsFirst(game.player);
// 
	
      // Auto-scale BEFORE positioning cards
      autoScaleHand(el.player, sorted.length, 95, 95);

      const evalPlayer = evaluate(sorted);
      const meldIds = meldCardIds(sorted, evalPlayer);
  //   comst sorted = sortHandUsingPattern(game.player, evalPlayer.melds);
      //    console.log("yes in render");
      //    console.log("game draw = ", game.drawn);
      
      
      gapInserted = false;
      let i= 0;
      const offset = 0; // move entire hand right
      
      for (const c of sorted) {
	  const isMeld = meldIds.has(c.id);
	  
	  // for scalling the spaces
	  let scale = 1;
	  if (el.player.classList.contains("normal")) scale = 1;
	  if (el.player.classList.contains("small")) scale = 0.8;
	  if (el.player.classList.contains("smaller")) scale = 0.65;
	  if (el.player.classList.contains("tiny")) scale = 0.5;
	  
	  const effectiveSpacing = 95 * scale;
	  
	  
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
	  f.style.left = `${offset + i * effectiveSpacing}px`;
	  
	  //    f.style.left = `${i * 75}px`;
	  f.style.top = "400px";
	  
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

    el.stockCount.textContent = "(" + game.stock.length + ")";

    if (game.discard.length) {
      const top = game.discard[game.discard.length-1];
      const f = cardFace(top);
      el.discard.innerHTML = "";
      el.discard.className = "card";
      el.discard.appendChild(f);
    } else {
      el.discard.className = "card back";
      el.discard.innerHTML = "<span>EMPTY</span>";
    }

     updateButtons();
  } // render


// -- part of render
// -- area:  866 .  Needed:  680 == normal
function autoScaleHand(container, handLength, cardWidth, spacing) {
    const table = document.getElementById("table"); // or your main game container
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
