const gameArea = document.getElementById("gameArea");

const gameState = {
  currentLevel: 0,
  money: 10000,
  spent: 0,
  savings: 0,
  score: 0,
  moneyQuizIndex: 0,
  scenarioQuizIndex: 0,
  scenarioMoney: 100000,
  scenarioSpent: 0,
  scenarioSavings: 0
};

const moneyLevels = [
  { nominal: 500, label: "Lima ratus rupiah" },
  { nominal: 1000, label: "Seribu rupiah" },
  { nominal: 2000, label: "Dua ribu rupiah" },
  { nominal: 5000, label: "Lima ribu rupiah" },
  { nominal: 10000, label: "Sepuluh ribu rupiah" },
  { nominal: 20000, label: "Dua puluh ribu rupiah" },
  { nominal: 50000, label: "Lima puluh ribu rupiah" },
  { nominal: 100000, label: "Seratus ribu rupiah" }
];

const shoppingMoneyOptions = [10000, 20000, 50000];
const scenarioMoneyOptions = [100000, 200000];

const shopItems = [
  { name: "Susu", price: 5000, type: "need" },
  { name: "Roti", price: 4000, type: "need" },
  { name: "Permen", price: 2000, type: "want" },
  { name: "Mainan Robot", price: 15000, type: "want" },
  { name: "Buku", price: 8000, type: "need" },
  { name: "Pensil", price: 3000, type: "need" },
  { name: "Buah", price: 6000, type: "need" },
  { name: "Air Mineral", price: 3000, type: "need" },
  { name: "Boneka", price: 20000, type: "want" },
  { name: "Balon", price: 5000, type: "want" },
  { name: "Mobil-mobilan", price: 12000, type: "want" },
  { name: "Tas Sekolah", price: 25000, type: "need" }
];

const scenarioQuestions = [
  {
    need: "Mau minum",
    correctOption: { name: "Air Mineral", price: 3000 },
    wrongOption: { name: "Mainan", price: 10000 }
  },
  {
    need: "Mau belajar",
    correctOption: { name: "Buku Tulis", price: 5000 },
    wrongOption: { name: "Balon", price: 5000 }
  },
  {
    need: "Mau makan",
    correctOption: { name: "Roti", price: 4000 },
    wrongOption: { name: "Boneka Kecil", price: 10000 }
  },
  {
    need: "Mau ke sekolah",
    correctOption: { name: "Pensil", price: 3000 },
    wrongOption: { name: "Permen Banyak", price: 3000 }
  },
  {
    need: "Mau bawa barang sekolah",
    correctOption: { name: "Tas Sekolah", price: 25000 },
    wrongOption: { name: "Mainan Robot", price: 25000 }
  },
  {
    need: "Mau sehat",
    correctOption: { name: "Buah", price: 6000 },
    wrongOption: { name: "Balon", price: 6000 }
  }
];

let shuffledMoneyLevels = [];
let sessionShopItems = [];
let sessionScenarioQuestions = [];

function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function setupNewGame() {
  shuffledMoneyLevels = shuffleArray(moneyLevels);

  gameState.money = getRandomItem(shoppingMoneyOptions);
  gameState.scenarioMoney = getRandomItem(scenarioMoneyOptions);

  sessionShopItems = shuffleArray(shopItems)
    .slice(0, 4)
    .map(item => ({
      ...item,
      isBought: false
    }));

  sessionScenarioQuestions = shuffleArray(scenarioQuestions)
    .slice(0, 4)
    .map(item => ({
      ...item
    }));
}

function renderStartScreen() {
  gameArea.innerHTML = `
    <h1>Game Literasi Keuangan Cilik</h1>
    <p>Yuk belajar mengenal uang rupiah!</p>
    <div class="center">
      <button onclick="startGame()">Mulai Game</button>
    </div>
  `;
}

function startGame() {
  setupNewGame();

  gameState.currentLevel = 1;
  gameState.spent = 0;
  gameState.savings = 0;
  gameState.score = 0;
  gameState.moneyQuizIndex = 0;
  gameState.scenarioQuizIndex = 0;
  gameState.scenarioSpent = 0;
  gameState.scenarioSavings = 0;

  renderMoneyIntro();
}

function renderMoneyIntro() {
  let moneyIndex = 0;

  function showMoneyCard() {
    const item = shuffledMoneyLevels[moneyIndex];

    gameArea.innerHTML = `
      <h2>Level 1: Kenalan Uang</h2>
      <p>Yuk kenali uang rupiah</p>

      <div class="money-card">
        ${formatRupiah(item.nominal)}
      </div>

      <p>${item.label}</p>

      <div class="center">
        <button id="nextMoneyBtn">
          ${moneyIndex < shuffledMoneyLevels.length - 1 ? "Lanjut" : "Mulai Tebak Uang"}
        </button>
      </div>
    `;

    document.getElementById("nextMoneyBtn").addEventListener("click", function () {
      if (moneyIndex < shuffledMoneyLevels.length - 1) {
        moneyIndex++;
        showMoneyCard();
      } else {
        gameState.moneyQuizIndex = 0;
        renderMoneyQuiz();
      }
    });
  }

  showMoneyCard();
}

function renderMoneyQuiz() {
  const quizItem = shuffledMoneyLevels[gameState.moneyQuizIndex];

  const wrongOptions = shuffledMoneyLevels.filter(
    item => item.nominal !== quizItem.nominal
  );

  const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];

  let options = [
    { text: formatRupiah(quizItem.nominal), correct: true },
    { text: formatRupiah(randomWrong.nominal), correct: false }
  ];

  options = shuffleArray(options);

  gameArea.innerHTML = `
    <h2>Level 1: Tebak Uang</h2>
    <p>Ini uang berapa?</p>

    <div class="money-card">
      ${formatRupiah(quizItem.nominal)}
    </div>

    <div class="option-list">
      ${options.map(option => `
        <button onclick="checkMoneyAnswer(${option.correct})">${option.text}</button>
      `).join("")}
    </div>

    <p>Soal ${gameState.moneyQuizIndex + 1} dari ${shuffledMoneyLevels.length}</p>
  `;
}

function checkMoneyAnswer(isCorrect) {
  const currentItem = shuffledMoneyLevels[gameState.moneyQuizIndex];

  if (isCorrect) {
    gameState.score += 10;
    alert(`Benar! Ini adalah ${formatRupiah(currentItem.nominal)}`);
  } else {
    alert(`Belum tepat. Ini adalah ${formatRupiah(currentItem.nominal)}`);
  }

  gameState.moneyQuizIndex++;

  if (gameState.moneyQuizIndex < shuffledMoneyLevels.length) {
    renderMoneyQuiz();
  } else {
    gameState.currentLevel = 2;
    renderShoppingLevel();
  }
}

function renderShoppingLevel() {
  const availableItemsHtml = sessionShopItems.map((item, index) => {
    const remainingMoney = gameState.money - gameState.spent;
    const isTooExpensive = item.price > remainingMoney;
    const isBought = item.isBought === true;

    return `
      <div class="shop-item">
        <h3>${item.name}</h3>
        <p>${formatRupiah(item.price)}</p>
        <button 
          onclick="buyItem(${index})"
          ${isBought || isTooExpensive ? "disabled" : ""}
        >
          ${isBought ? "Sudah Dibeli" : "Beli"}
        </button>
      </div>
    `;
  }).join("");

  gameArea.innerHTML = `
    <h2>Level 2: Belanja</h2>
    <p>Uangmu sekarang <strong>${formatRupiah(gameState.money)}</strong></p>
    <p>Pilih barang yang bisa dibeli</p>

    <div class="option-list">
      ${availableItemsHtml}
    </div>

    <div class="result-box">
      <p>Sudah dibelanjakan: <strong>${formatRupiah(gameState.spent)}</strong></p>
      <p>Sisa uang: <strong>${formatRupiah(gameState.money - gameState.spent)}</strong></p>
      <button onclick="goToScenarioLevel()">Lanjut ke Pilih yang Paling Tepat</button>
    </div>
  `;
}

function buyItem(index) {
  const item = sessionShopItems[index];
  const remainingMoney = gameState.money - gameState.spent;

  if (item.isBought) {
    alert(`${item.name} sudah dibeli ya 😊`);
    return;
  }

  if (item.price <= remainingMoney) {
    item.isBought = true;
    gameState.spent += item.price;
    gameState.score += 10;
    alert(`Yeay! Kamu membeli ${item.name}`);
  } else {
    alert("Uangnya belum cukup ya 😊");
  }

  renderShoppingLevel();
}

function goToScenarioLevel() {
  gameState.currentLevel = 3;
  gameState.scenarioQuizIndex = 0;
  gameState.scenarioSpent = 0;
  renderScenarioLevel();
}

function renderScenarioLevel() {
  const question = sessionScenarioQuestions[gameState.scenarioQuizIndex];
  const remainingScenarioMoney = gameState.scenarioMoney - gameState.scenarioSpent;

  let options = [
    {
      name: question.correctOption.name,
      price: question.correctOption.price,
      correct: true
    },
    {
      name: question.wrongOption.name,
      price: question.wrongOption.price,
      correct: false
    }
  ];

  options = shuffleArray(options);

  gameArea.innerHTML = `
    <h2>Level 3: Pilih yang Paling Tepat</h2>
    <p>Saldo awal: <strong>${formatRupiah(gameState.scenarioMoney)}</strong></p>
    <p>Sisa saldo: <strong>${formatRupiah(remainingScenarioMoney)}</strong></p>
    <p>Kebutuhan: <strong>${question.need}</strong></p>

    <div class="option-list">
      ${options.map(option => `
        <div class="card">
          <h3>${option.name}</h3>
          <p>${formatRupiah(option.price)}</p>
          <button onclick="checkScenarioAnswer(${option.correct}, ${option.price})">Pilih</button>
        </div>
      `).join("")}
    </div>

    <p>Soal ${gameState.scenarioQuizIndex + 1} dari ${sessionScenarioQuestions.length}</p>
  `;
}

function checkScenarioAnswer(isCorrect, price) {
  const question = sessionScenarioQuestions[gameState.scenarioQuizIndex];
  const remainingScenarioMoney = gameState.scenarioMoney - gameState.scenarioSpent;

  if (isCorrect) {
    if (price <= remainingScenarioMoney) {
      gameState.score += 10;
      gameState.scenarioSpent += price;
      alert(`Benar! Kamu memilih ${question.correctOption.name}.`);
    } else {
      alert("Saldo kamu tidak cukup untuk pilihan itu.");
    }
  } else {
    alert(`Belum tepat. Untuk kebutuhan "${question.need}", pilihan yang paling tepat adalah ${question.correctOption.name}.`);
  }

  gameState.scenarioQuizIndex++;

  if (gameState.scenarioQuizIndex < sessionScenarioQuestions.length) {
    renderScenarioLevel();
  } else {
    goToSavingLevel();
  }
}

function goToSavingLevel() {
  gameState.currentLevel = 4;
  renderSavingLevel();
}

function renderSavingLevel() {
  const remainingMoneyLevel2 = gameState.money - gameState.spent;
  const remainingMoneyLevel3 = gameState.scenarioMoney - gameState.scenarioSpent;

  gameState.savings = remainingMoneyLevel2 + remainingMoneyLevel3;
  gameState.scenarioSavings = remainingMoneyLevel3;

  gameArea.innerHTML = `
    <h2>Level 4: Menabung</h2>

    <p>Sisa uang dari belanja: <strong>${formatRupiah(remainingMoneyLevel2)}</strong></p>
    <p>Sisa saldo dari pilihan kebutuhan: <strong>${formatRupiah(remainingMoneyLevel3)}</strong></p>

    <div class="money-card">
      🐷 Total Tabungan
      <br />
      ${formatRupiah(gameState.savings)}
    </div>

    <div class="center">
      <button onclick="finishGame()">Selesai</button>
    </div>
  `;
}

function finishGame() {
  gameArea.innerHTML = `
    <h2>Hebat!</h2>
    <p>Kamu sudah belajar mengenal uang, belanja, memilih kebutuhan, dan menabung.</p>
    <p>Total skor kamu: <strong>${gameState.score}</strong></p>
    <p>Total tabunganmu: <strong>${formatRupiah(gameState.savings)}</strong></p>

    <div class="center">
      <button onclick="resetGame()">Main Lagi</button>
    </div>
  `;
}

function resetGame() {
  gameState.currentLevel = 0;
  gameState.money = 10000;
  gameState.spent = 0;
  gameState.savings = 0;
  gameState.score = 0;
  gameState.moneyQuizIndex = 0;
  gameState.scenarioQuizIndex = 0;
  gameState.scenarioMoney = 100000;
  gameState.scenarioSpent = 0;
  gameState.scenarioSavings = 0;

  renderStartScreen();
}

renderStartScreen();