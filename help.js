function showHelpViewer(pages) {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear previous content

    let pageIndex = 0;

    // changed from a pre but now using a paragraph
    const pre = document.createElement("div");

    // new pager

    const pageLabels = [
	"About",
	"How To Play",
	"Scoring",
	"Dialog Boxes",
	"Developer Tools",
	"Technical Notes"
    ];

    const pager = document.createElement("div");
    pager.style.display = "flex";
    pager.style.gap = "8px";
    pager.style.marginBottom = "12px";
    pager.style.flexWrap = "wrap";
    pager.style.rowGap = "6px";
    pager.style.maxWidth = "800px"; // adjust to taste
    
    for (let i = 0; i < pages.length; i++) {
	const btn = document.createElement("button");
//	btn.textContent = (i + 1);
	 btn.textContent = pageLabels[i]; // ← USE LABELS INSTEAD OF NUMBERS
	btn.style.padding = "4px 10px";
	btn.onclick = () => {
            pageIndex = i;
            updatePage();
	};
	pager.appendChild(btn);
    }
    
    extra.appendChild(pager);
    // end of pager
    
    pre.id = "doc-pre";
//    pre.style.whiteSpace = "pre-wrap";
    pre.style.whiteSpace = "normal";
    //    pre.style.fontFamily = "monospace";
    pre.style.fontFamily = "inherit";
    pre.style.fontSize = "14px";
    pre.style.maxHeight = "60vh";
    pre.style.overflowY = "auto";
    pre.style.padding = "12px";
    pre.style.background = "#f0f0f0";
    pre.style.color = "#000";
    pre.style.borderRadius = "6px";
    pre.style.marginBottom = "12px";

    const nav = document.createElement("div");
    nav.style.display = "flex";
    nav.style.justifyContent = "space-between";
    nav.style.marginTop = "8px";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "◀ Prev";
    btnPrev.disabled = true;

    const btnNext = document.createElement("button");
    btnNext.textContent = "Next ▶";

    function updatePage() {
//        pre.textContent = pages[pageIndex];
	pre.innerHTML = pages[pageIndex];

        btnPrev.disabled = pageIndex === 0;
        btnNext.disabled = pageIndex === pages.length - 1;
    } //updatePage

    btnPrev.onclick = () => {
        if (pageIndex > 0) {
            pageIndex--;
            updatePage();
        }
    };

    btnNext.onclick = () => {
        if (pageIndex < pages.length - 1) {
            pageIndex++;
            updatePage();
        }
    };

    nav.appendChild(btnPrev);
    nav.appendChild(btnNext);

    extra.appendChild(pre);
    extra.appendChild(nav);

    updatePage();
    showMessage("Help & About");
}//showHelpViewer

function showHelp() {
    const pages = [

/* -----------------------------------------------------------
   PAGE 1 — ABOUT & OVERVIEW 
------------------------------------------------------------ */
	`

<h2>📘 About This Game</h2>
<strong>Gin Rummy (v2.1)</strong> is a clean, browser‑based two‑player Gin Rummy game where 
you face a CPU opponent. The interface is designed for clarity, smooth flow, and easy learning.

You can <strong>press the page buttons above</strong> (About / Contents / Text) to switch between 
sections. You can also scroll inside this window.

<div style="background:#e8f3ff;border:1px solid #a7c8ff;padding:10px;border-radius:6px;margin:10px 0;">
<strong>💡 Quick Tip:</strong> Anywhere you see a blue button, you can press it.  
Anywhere you see a highlighted box like this, it contains helpful info.
</div>

<h3>🎯 Game Focus</h3>
<ul>
  <li><strong>Clarity</strong> — readable cards, clean layout, clear status messages.</li>
  <li><strong>Fair Play</strong> — standard 52‑card deck, shuffled each game.</li>
  <li><strong>Learning</strong> — automatic deadwood calculation and meld detection.</li>
</ul>

<h3>🎮 Objective of Gin Rummy</h3>
<p>The goal is to form <strong>melds</strong> (sets or runs) and reduce your <strong>deadwood</strong> 
(unmatched cards). A hand ends when a player:</p>

<ul>
  <li>✨ Goes <strong>Gin</strong> (0 deadwood)</li>
  <li>🔔 <strong>Knocks</strong> (deadwood ≤ 10)</li>
  <li>📉 Or the stock pile becomes too small</li>
</ul>

<h3>🧩 Meld Types</h3>
<ul>
  <li><strong>Sets</strong>: 3–4 cards of the same rank (e.g., 7♣ 7♥ 7♠)</li>
  <li><strong>Runs</strong>: 3+ cards in sequence, same suit (e.g., 4♠ 5♠ 6♠)</li>
</ul>

<div style="background:#fff4d6;border:1px solid #f0c36d;padding:10px;border-radius:6px;margin-top:12px;">
<strong>📌 Note:</strong> This help system is built into the game — no internet required.
</div>

`,

/* -----------------------------------------------------------
   PAGE 2 — HOW TO PLAY + CONTROLS (with icons + callouts)
------------------------------------------------------------ */
`
<h2>🃏 How to Play</h2>

<h3>🔄 Turn Structure</h3>
<ol>
  <li><strong>Draw</strong> a card (from stock or discard).</li>
  <li>Evaluate your hand (deadwood auto‑updates).</li>
  <li><strong>Discard</strong> one card to end your turn.</li>
</ol>

<p>The CPU then takes its turn using its own strategy.</p>

<h3>🏁 Ending a Hand</h3>
<ul>
  <li>✨ <strong>Gin</strong> — all cards in melds (0 deadwood).</li>
  <li>🔔 <strong>Knock</strong> — deadwood ≤ knock limit.</li>
  <li>📉 <strong>Stock Exhaustion</strong> — automatic draw.</li>
</ul>

<div style="background:#e6ffe6;border:1px solid #8cd48c;padding:10px;border-radius:6px;margin:10px 0;">
<strong>💡 Tip:</strong> Watch the <strong>Deadwood:</strong> display — it tells you when you’re close 
to knocking or Gin.
</div>

<h2>🖱️ Controls</h2>

<p>You can <strong>press these buttons</strong> during play:</p>

<ul>
  <li>🆕 <strong>New Match</strong> — resets both scores to 0.</li>
  <li>🔄 <strong>New Game</strong> — starts a new hand (scores stay).</li>
  <li>🔔 <strong>Knock</strong> — end the hand if your deadwood is low enough.</li>
  <li>✨ <strong>Gin</strong> — end the hand with 0 deadwood.</li>
</ul>

<h3>📍 Other UI Elements</h3>
<ul>
  <li>📦 <strong>Stock pile</strong> — face‑down deck; count shown below.</li>
  <li>🗑️ <strong>Discard pile</strong> — top card face‑up; you may draw it.</li>
  <li>📊 <strong>Deadwood display</strong> — auto‑calculated.</li>
  <li>⭐ <strong>Stars/icons</strong> — decorative or future indicators.</li>
</ul>

<div style="background:#fff0f0;border:1px solid #e0a0a0;padding:10px;border-radius:6px;margin-top:10px;">
<strong>⚠️ Reminder:</strong> You must <strong>press a card</strong> to discard — dragging is not used.
</div>
<h3>This is what the initial screen looks like:</h3>
<img src="images/screenShots/initialScreen.png" style="max-width: 200px;
display:block; margin: 12px 0;">
<p>
Press New Game to start to play.
</p>
<h3>After you start the game, this is the game screen</h3>
<img src="images/screenShots/gameScreen.png" style="max-width: 200px;
display:block; margin: 12px 0;">
`,

/* -----------------------------------------------------------
   PAGE 3 — SCORING, CPU
------------------------------------------------------------ */
`
<h2>🏆 Scoring</h2>

<h3>🧮 Card Values</h3>
<ul>
  <li>Ace = 1</li>
  <li>2–10 = face value</li>
  <li>J, Q, K = 10</li>
</ul>

<h3>📈 Scoring Events</h3>
<ul>
  <li>🔔 <strong>Knock Win</strong> — score = deadwood difference.</li>
  <li>✨ <strong>Gin Bonus</strong> — extra points for going Gin.</li>
  <li>⚔️ <strong>Undercut</strong> — defender wins if their deadwood ≤ knocker’s.</li>
</ul>

<div style="background:#e8f3ff;border:1px solid #a7c8ff;padding:10px;border-radius:6px;margin:10px 0;">
<strong>💡 Tip:</strong> A low deadwood knock is often safer than chasing Gin too long.
</div>

<h2>🤖 CPU Behavior</h2>
<p>The CPU uses a rule‑based strategy:</p>
<ul>
  <li>Evaluates its own melds and deadwood.</li>
  <li>Chooses stock vs discard intelligently.</li>
  <li>Discards based on safety and meld potential.</li>
  <li>Knocks or goes Gin when appropriate.</li>
</ul>
`,
/* -----------------------------------------------------------
   PAGE 4 - Dialog Boxes
------------------------------------------------------------ */
	`
<h3>Top part of dialog box:</h3>
<img src="images/screenShots/dialogTop.png" style="max-width: 200px;
display:block; margin: 12px 0;">

<h3>Bottom part of dialog box:</h3>
<img src="images/screenShots/dialogBottom.png" style="max-width: 200px;
display:block; margin: 12px 0;">

`,
/* -----------------------------------------------------------
   PAGE 5 — Developer Tools:  BACKDOOR
------------------------------------------------------------ */
	
`<h2>🛠️ Back‑Door Tools</h2>
<p>You can <strong>press</strong> these only when the hidden panel is enabled:</p>
<ul>
  <li>💾 Save / Restore State</li>
  <li>🃏 Show CPU Cards</li>
  <li>🧪 Test Melds</li>
  <li>📊 Show Stats</li>
  <li>🎨 Pick Card Deck</li>
  <li>📜 Show/Hide Log</li>
  <li>💾 Save Logfile</li>
</ul>

<div style="background:#fff0f0;border:1px solid #e0a0a0;padding:10px;border-radius:6px;margin:10px 0;">
<strong>⚠️ Warning:</strong> These tools are for development/testing.  
They can break a running game if used mid‑hand.
</div>

<h3>Developer Buttons at bottom of screen</h3>
<img src="images/screenShots/devButtons.png" style="max-width: 200px;
display:block; margin: 12px 0;">

<h2>How to open & close the Backdoor</h2>
<p>To <strong>open</strong> the back too set you double tap the player cards. Double tap a
different card and do this
three (maybe four) times.  This will show you a series of buttons below the player's hand.  These
buttons are described about.
</p>
<p>
To <strong>close</strong> the backdoor, simply double-tap one of the player cards.
The developer buttons will then
disapear.
</p>`,
	
/* -----------------------------------------------------------
   PAGE 6 — TECHNICAL Notes
------------------------------------------------------------ */

`<h2>🧩 Technical Notes</h2>
<ul>
  <li>Runs entirely in your browser.</li>
  <li>No installation required.</li>
  <li>All logic implemented in JavaScript modules.</li>
  <li>Version: <strong>v2.1 Feb 2026</strong></li>
</ul>

<div style="background:#e6ffe6;border:1px solid #8cd48c;padding:10px;border-radius:6px;">
<strong>💡 Tip:</strong> You can press “OK” below to close this help window at any time.
</div>
`
    ];

    showHelpViewer(pages);
}
/*
function showHelp() {
    const pages = [
	"<h2>About:</h2>" +
	    "<p>THIS IS STILL BEING BUILT --- " +
	    "<p>This document provides a <bold>clear</bold> and complete overview of how to play" +
	    "Gin Rummy. It explains the flow of the game, how cards are dealt, how turns work," +
	    "guide will walk you through everything you need to know. (version 4, Feb 18, 2026)" +
	    "</p>",
	
	"TABLE OF CONTENTS:" + "\n" +
	    "1. Intro – Overview of Gin Rummy and its popularity." + "\n" +
	    "     -  Gin Bonus:    Bonus points for going Gin." + "\n" +
	    "9. Undercut – When the defender beats the knocker." + "\n" + "\n\n",
	
	"Text: Gin Rummy is a two-player card game that has enjoyed widespread popularity as" + "\n" +
	    "6, 5, 4, 3, 2, Ace. \n\n"
	
    ];
    
    showHelpViewer(pages);
} // showHelp
*/
