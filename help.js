function showHelpViewer(pages) {
    const extra = document.getElementById("modal-extra");
    extra.innerHTML = ""; // clear previous content

    let pageIndex = 0;

    // changed from a pre but now using a paragraph
    const pre = document.createElement("div");

    // new pager

    const pageLabels = [
	"About",
	"Contents",
	"Text"
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
