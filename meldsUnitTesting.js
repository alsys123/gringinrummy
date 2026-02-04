/*
function testMelds() {
    const message =
	  `Hey there\n\n` +
	  '';
    
    showMessage(message);
    
    return;
} // testMelds
*/

/*
  Unit testing for Melds
  
 */

/*
function testMelds() {

  // Helper to build cards
  function C(rank, suit) {
    const values = { A:1, J:10, Q:10, K:10 };
    return {
      rank,
      suit,
      value: values[rank] || Number(rank)
    };
  }

  // Test hand (run + set)
  const hand = [
    C("A","♣"),  // 0
    C("2","♣"),  // 1
    C("3","♣"),  // 2
    C("7","♥"),  // 3
    C("7","♦"),  // 4
    C("7","♣"),  // 5
    C("9","♠"),  // 6
    C("J","♣"),  // 7
    C("4","♦"),  // 8
    C("K","♥")   // 9
  ];

  // Expected melds
  const expected = [
    [0,1,2],   // run
    [3,4,5]    // set
  ];

  // Normalize helper (so ordering doesn't break tests)
  const normalize = arr =>
    arr.map(m => m.slice().sort((a,b)=>a-b))
       .sort((a,b)=>a[0]-b[0]);

  const result = normalize(getAllMeldsv2(hand));
  const expectedNorm = normalize(expected);

  const pass = JSON.stringify(result) === JSON.stringify(expectedNorm);

  const message =
    `🃏 **Meld Unit Test**\n\n` +
    `Hand: ${hand.map((c,i)=>`${i}:${c.rank}${c.suit}`).join("  ")}\n\n` +
    `Expected melds: ${JSON.stringify(expectedNorm)}\n` +
    `Got:            ${JSON.stringify(result)}\n\n` +
    `Result: **${pass ? "PASS ✅" : "FAIL ❌"}**`;

  showMessage(message);
}
*/



/* first example only
const meldTests = [

  {
    name: "Test 1 — Run + Set",
    hand: [
      C("A","♣"),  // 0
      C("2","♣"),  // 1
      C("3","♣"),  // 2
      C("7","♥"),  // 3
      C("7","♦"),  // 4
      C("7","♣"),  // 5
      C("9","♠"),  // 6
      C("J","♣"),  // 7
      C("4","♦"),  // 8
      C("K","♥")   // 9
    ],
    expected: [
      [0,1,2],   // run
      [3,4,5]    // set
    ]
  },

  // Add more tests here:
  // {
  //   name: "Test 2 — Only Runs",
  //   hand: [...],
  //   expected: [...]
  // }

];
*/

function testMelds() {

    let message = "🃏 **Meld Unit Tests**\n\n";
    let passed = 0;
    let total = meldTests.length;
    
    // Normalizer so ordering doesn't break tests
  const normalize = arr =>
    arr.map(m => m.slice().sort((a,b)=>a-b))
       .sort((a,b)=>a[0]-b[0]);


    for (const t of meldTests) {

	console.log("Run test: ",t.name);

	const result = normalize(getAllMeldsv3(t.hand));

//      const result = normalize(getAllMeldsv2(t.hand));
//      console.log("my Result: ", result);
      
      const expected = normalize(t.expected);

    const pass = JSON.stringify(result) === JSON.stringify(expected);
      if (pass) passed++;
      
    message += `**${t.name}**\n`;
      message += `Hand: ${t.hand.map((c,i)=>`${i}) ${c.rank}${c.suit}`).join("  ")}  `;
    message += `Expected: ${JSON.stringify(expected)} ➜ `;
    message += `${JSON.stringify(result)} `;
    message += `${pass ? "✅" : "❌"}**\n\n`;

   
  }

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

