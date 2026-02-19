function showDocumentViewer(pages) {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear previous content

    let pageIndex = 0;

    const pre = document.createElement("pre");
    // new pager

    const pageLabels = [
	"About",
	"Contents",
	"Intro",
	"Objective",
	"Play",
	"Knocking",
	"Big Gin",
	"Scoring",
	"Undercut"
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
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontFamily = "monospace";
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
        pre.textContent = pages[pageIndex];
        btnPrev.disabled = pageIndex === 0;
        btnNext.disabled = pageIndex === pages.length - 1;
    }

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
    showMessage("Gin Rummy Rules");
}//showDocumentViewer


function showRules() {
    const pages = [
	"ABOUT THIS GUIDE: This document provides a clear and complete overview of how to play" + "\n" +
	    "Gin Rummy. It explains the flow of the game, how cards are dealt, how turns work," + "\n" +
	    "how to knock, how scoring is calculated, and the special rules such as Gin, Big Gin," + "\n" +
	    "and undercuts. Whether you are new to the game or brushing up on the rules, this" + "\n" +
	    "guide will walk you through everything you need to know. (version 4, Feb 18, 2026)\n\n",
	
	"TABLE OF CONTENTS:" + "\n" +
	    "1. Intro – Overview of Gin Rummy and its popularity." + "\n" +
	    "     - Deck – Card ranks and deck structure." + "\n" +
	    "3. Objective – What players are trying to achieve." + "\n" +
	    "     - Deal – How cards are dealt and how rounds begin." + "\n" +
	    "5. Play – Turn structure, drawing, discarding, and round flow." + "\n" +
	    "6. Knocking – How a hand ends and how deadwood is handled." + "\n" +
	    "7. Big Gin – Special 11‑card Gin rule and scoring." + "\n" +
	    "8. Scoring – Deadwood values and point calculations." + "\n" +
	    "     -  Knock Points: Scoring when knocking with deadwood." + "\n" +
	    "     -  Gin Bonus:    Bonus points for going Gin." + "\n" +
	    "9. Undercut – When the defender beats the knocker." + "\n" + "\n\n",
	
	"INTRO: Gin Rummy is a two-player card game that has enjoyed widespread popularity as" + "\n" +
	    "both a social and gambling game, especially during the mid twentieth century. It" + "\n" +
	    "remains today one of the most widely played two-player card games.\n\n" +
	
        "DECK: Gin Rummy is played using a standard deck of 52 cards. The" + "\n" +
	    "ranking from high to low is King, Queen, Jack, 10, 9, 8, 7, "+ "\n" +
	    "6, 5, 4, 3, 2, Ace. \n\n",
	
	"OBJECTIVE: The objective in Gin Rummy is to be the first to reach an agreed-upon score," + "\n" +
	    "usually 100 points. The basic strategy is to improve your hand by forming melds and" + "\n" +
	    "eliminating deadwood. Gin has two types of melds: Sets of three or four cards sharing" + "\n" +
	    "the same rank (e.g., 8♥ 8♦ 8♠), and runs or sequences of three or more cards in the" + "\n" +
	    "same suit (e.g., 3♥ 4♥ 5♥). Deadwood cards are those not included in any meld." + "\n\n" +
	    "Aces are always low—they can form a set with other aces, but only appear at the low" + "\n" +
	    "end of runs (A♠ 2♠ 3♠ is legal, but Q♠ K♠ A♠ is not). A player may form any mix of" + "\n" +
	    "sets and runs within their hand.\n\n" +
	
	"DEAL: Dealership alternates from round to round, with the first dealer chosen by any" + "\n" +
	    "agreed-upon method. The dealer deals ten cards to each player one at a time," + "\n" +
	    "starting with their opponent, and then places the next card in the deck face up." + "\n" +
	    "This begins the discard pile. The remaining face-down cards form the stock pile." + "\n\n",
	
	"PLAY: On the first turn of the round, the non-dealer has the first option of taking the" + "\n" +
	    "upcard from the discard pile or passing. If the non-dealer takes the upcard, they must" + "\n" +
	    "then discard a different card. The player acting second may draw from either pile." + "\n" +
	    "However, if the non-dealer passes the upcard, the dealer may take it or pass. If both" + "\n" +
	    "players pass, the non-dealer must draw from the stock pile. After this opening turn," + "\n" +
	    "players may draw from either pile on each turn." + "\n\n" +
	    "On each subsequent turn, a player must draw either the face-up top card of the discard" + "\n" +
	    "pile or the face-down top card of the stock pile, and then discard one card. A player" + "\n" +
	    "who draws the face-up card may not discard that same card." + "\n\n" +
	    "Players alternate turns until one player ends the round by knocking, or until only two" + "\n" +
	    "cards remain in the stock pile, in which case the round ends in a draw. The game ends" + "\n" +
	    "when a player reaches 100 or more points.\n\n",
	
	"KNOCKING: In standard Gin, a player with 10 or fewer points of deadwood may knock," + "\n" +
	    "immediately ending the hand. Knocking with no deadwood is called going Gin, while" + "\n" +
	    "knocking with deadwood is called going down." + "\n\n" +
	    "When discarding to end a turn, a player who wishes to knock must clearly indicate" + "\n" +
	    "their intent—typically by placing the discard face down, verbally declaring, or tapping" + "\n" +
	    "the table. The player then lays out their hand, showing melds and separating deadwood." + "\n" +
	    "The opponent (the defending player) reveals their melds and may lay off deadwood onto" + "\n" +
	    "the knocker's melds, unless the knocker has gone Gin." + "\n\n" +
	    "The deadwood count is the sum of the point values of deadwood cards. Aces count as 1," + "\n" +
	    "face cards as 10, and all others at numerical value. Intersecting melds are not allowed;" + "\n" +
	    "a card may belong to only one meld. For example, in 7♣ 7♠ 7♦ 8♦ 9♦, the 7♦ may be used" + "\n" +
	    "in the set or the run, but not both." + "\n\n" +
	    "If the knocker has the lower deadwood count, they score the difference. The defender" + "\n" +
	    "may undercut the knocker by having an equal or lower deadwood count, scoring the" + "\n" +
	    "difference plus an undercut bonus (commonly 25 points). A player who goes Gin scores" + "\n" +
	    "a Gin bonus (typically 25 points) plus the opponent's entire deadwood count.\n\n",
	
	"BIG GIN: A player holding a Gin hand may choose to continue the round instead of" + "\n" +
	    "revealing it, hoping to form an 11-card Big Gin. If a player draws or takes a card" + "\n" +
	    "that completes melds with all 10 cards already held, the player declares Big Gin and" + "\n" +
	    "the hand ends immediately. The player scores a Big Gin bonus (typically 31 points)" + "\n" +
	    "plus the defender's entire deadwood count. The defender may not lay off any cards." + "\n\n",
	
	"SCORING: Aces count as 1 point, face cards as 10, and all other cards at their" + "\n" +
	    "numerical values. Deadwood is the total point value of all cards not included in" + "\n" +
	    "melds. The difference in deadwood between the two players determines the score" + "\n" +
	    "awarded for the hand.\n\n" +
	
	"KNOCK POINTS: After a player knocks and layoffs are made, the knocker scores the" + "\n" +
	    "difference between the two deadwood counts. For example, if a player knocks with 8" + "\n" +
	    "deadwood and the defender has 10 after laying off, the knocker scores 2 points." + "\n" +
	    "If a player knocks before any cards are accepted, it is considered a misdeal.\n\n" +
	
	"GIN BONUS: A player who goes Gin (ending the hand with no deadwood) receives a" + "\n" +
	    "bonus of 25 points plus the entire count of deadwood in the opponent's hand. The" + "\n" +
	    "opponent cannot lay off any cards when the knocker goes Gin.\n\n",
	
	"UNDERCUT: An undercut occurs when the defending player has a deadwood count lower" + "\n" +
	    "than or equal to that of the knocker. The defender scores the difference plus an" + "\n" +
	    "undercut bonus (commonly 25 points, though some rules use 20 or 10). An undercut" + "\n" +
	    "may occur either before or after the defender lays off cards. A knocker can never" + "\n" +
	    "lay off their own deadwood into the defender's melds.\n\n"
	
    ];
    
    showDocumentViewer(pages);
} // showRules
