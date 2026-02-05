
// Utils used in any file below.

function runValue(rank) {
  const map = { A:1, J:11, Q:12, K:13 };
  return map[rank] ?? Number(rank);
}

function deadwoodValue(rank) {
  if (rank === "A") return 1;
  if (["J","Q","K"].includes(rank)) return 10;
  return Number(rank);
}
