
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

function printCards(arr) {
  console.log(
    arr.map(c => `${c.rank}${c.suit} (run:${c.runValue}, dead:${c.deadwoodValue}, id:${c.id})`)
       .join("  ")
  );
}

function printSet(set) {
  console.log(
    [...set].map(c => `${c.rank}${c.suit} (id:${c.id}, run:${c.runValue})`).join("  ")
  );
}
