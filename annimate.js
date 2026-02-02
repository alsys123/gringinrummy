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
  flying.style.transition = "all 1000ms ease-out";

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
