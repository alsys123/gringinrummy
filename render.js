
  /* ------------------------------
     Rendering
  ------------------------------ */


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
