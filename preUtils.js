
// Utils used in any file below.

function runValue(rank) {
  const map = { A:1, J:11, Q:12, K:13 };
  return map[rank] ?? Number(rank);
}
/*
function deadwoodValue(rank) {
  if (rank === "A") return 1;
  if (["J","Q","K"].includes(rank)) return 10;
  return Number(rank);
*/
function deadwoodValue(rank) {
  // Normalize numeric ranks to string for comparison
  const r = typeof rank === "number" ? rank : rank.toUpperCase();

  if (r === 1 || r === "A") return 1;
  if (r === 11 || r === "J") return 10;
  if (r === 12 || r === "Q") return 10;
  if (r === 13 || r === "K") return 10;

  return Number(r);
}

function logPrintCards(arr) {
  console.log(
    arr.map(c => `${c.rank}${c.suit} (run:${c.runValue}, dead:${c.deadwoodValue}, id:${c.id})`)
       .join("  ")
  );
}

function logPrintSet(set) {
  console.log(
    [...set].map(c => `${c.rank}${c.suit} (id:${c.id}, run:${c.runValue})`).join("  ")
  );
}


function consoleLogHand(hand,melds) {
//    console.log(melds);
//    console.log("-- evaluate -- ");
    //    console.log(  "\nHand: ", hand.map((c, i) => `${i}:${c.rank}${c.suit}`).join(" "));
    console.log("\n"); 
//    console.log(`Game Turn: ${game.turn}`);
    console.log(`Hand: ${hand.map((c,i) => `${i}) ${c.rank}${c.suit}`).join(" ")}`  );
console.log("" +  
    	    `Hand: ${hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );
console.log("VALUES:", hand.map(c => `${c.rank}:${c.runValue}`).join("  "));

console.log("MELDS:", JSON.stringify(melds));

}    
