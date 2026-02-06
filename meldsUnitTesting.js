
let nextCardID = 0;
/* ------------------------------
   Unit Testing of Meld
   ------------------------------ */
function upgradeCard(c) {
  return {
    rank: c.rank,
    suit: c.suit,
    runValue: runValue(c.rank),
    deadwoodValue: deadwoodValue(c.rank),
      //    id: c.id
      id: c.id ?? nextCardID++   // ⭐ only assign if missing
  };
}

function upgradeHand(hand) {
  return hand.map(upgradeCard);
}

//__ testMelds
function testMelds() {
    
    let message = "🃏 **Meld Unit Tests**\n\n";
    let passed = 0;
    let total = meldTests.length;
    
    // Normalizer so ordering doesn't break tests
    const normalize = arr =>
	  arr.map(m => m.slice().sort((a,b)=>a-b))
	  .sort((a,b)=>a[0]-b[0]);
    
    
    for (const t of meldTests) {
	
	console.log("**** Run test **** : ",t.name);

	// *** THIS IS FOR TESTING ONE TEST ONLY!!!
//	if (!t.name.startsWith("BC15")) { continue; }
	
	//	console.log("orig t.hand: ",t.hand);
	const newHand = upgradeHand(t.hand);
//	console.log("new ==> ",newHand);
	
	// before the upgrade
//	const result = normalize(getAllMeldsv3(t.hand));
	const result = normalize(getAllMeldsv3(newHand));
	console.log("\n" +  
		`Hand: ${t.hand.map((c,i) => `C("${c.rank}","${c.suit}")`).join(",")}`  );

	//      const result = normalize(getAllMeldsv2(t.hand));
//	console.log("In evaluate v3 ... MELDS:", JSON.stringify(testResult));

	console.log("my Result: ", JSON.stringify(result));
      
	const expected = normalize(t.expected);
	
	const pass = JSON.stringify(result) === JSON.stringify(expected);
	if (pass) passed++;

	
	message += `**${t.name}**\n`;
	message += `Hand: ${t.hand.map((c,i)=>`${i}) ${c.rank}${c.suit}`).join("  ")}  `;
    message += `Expected: ${JSON.stringify(expected)} ➜ `;
    message += `${JSON.stringify(result)} `;
    message += `${pass ? "✅" : "❌"}**\n\n`;
    
} // for 

const pct = ((passed / total) * 100).toFixed(1);
message += `----------------------------------------\n`;
message += `Passed: ${passed} / ${total} (${pct}%)\n`;
message += `----------------------------------------`;

showMessage(message);
} // testMelds



/*
  TESTING BEST COMBO and deadwood
*/

function testBestCombos() {
    
    let message = "🔥 Best Combo + Deadwood Tests\n\n";
    let passed = 0;
    let total = bestComboTests.length;
    
    const normalize = arr =>
    arr.map(m => m.slice().sort((a,b)=>a-b))
       .sort((a,b)=>a[0]-b[0]);

  for (const t of bestComboTests) {

    const result = bestMeldCombo(t.hand);

    const meldsNorm = normalize(result.melds);
    const expectedNorm = normalize(t.expectedMelds);

    const meldsPass = JSON.stringify(meldsNorm) === JSON.stringify(expectedNorm);
      const deadwoodPass = result.deadwood === t.expectedDeadwood;
      const pass = meldsPass && deadwoodPass;
      if (pass) passed++;

      message += `**${t.name}**\n`;
      message += `Hand: ${t.hand.map((c,i)=>`${i}) ${c.rank}${c.suit}`).join("  ")}\n`;
    message += `Expected melds: ${JSON.stringify(expectedNorm)} ➜ `;
    message += `Got melds: ${JSON.stringify(meldsNorm)}\n`;
    message += `Expected deadwood: ${t.expectedDeadwood} ➜ `;
    message += `Got: ${result.deadwood}  `;
    message += `**${(meldsPass && deadwoodPass) ? "✅" : "❌"}**\n\n`;
  }

    const pct = ((passed / total) * 100).toFixed(1);
    message += `----------------------------------------\n`;
    message += `Passed: ${passed} / ${total} (${pct}%)\n`;
    message += `----------------------------------------`;

    
  showMessage(message);
}

