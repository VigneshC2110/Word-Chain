let usedWords = [];
let previousWord = "";
let score = 0;
let timer;
let timeLimit = 60;

function startGameWithRandomWord() {
  fetch('https://random-word-api.vercel.app/api?words=1')
    .then(res => res.json())
    .then(words => {
      const word = words[0].toLowerCase();
      validateWord(word).then(isValid => {
        if (isValid) {
          previousWord = word;
          beginGame();
        } else {
          startGameWithRandomWord();
        }
      });
    })
    .catch(err => {
      alert("Failed to get a random word. Starting manually instead.");
      console.error(err);
      startGameManual(); 
    });
}

function startGameManual() {
  let inputWord = prompt("Enter a starting English word:");
  if (!inputWord || inputWord.trim() === "") return;

  inputWord = inputWord.toLowerCase();
  validateWord(inputWord).then(isValid => {
    if (!isValid) {
      alert("That word is not valid!");
    } else {
      previousWord = inputWord;
      beginGame();
    }
  });
}

function beginGame() {
  usedWords = [previousWord];
  score = 0;
  document.getElementById("previous-word").innerText = previousWord;
  document.getElementById("start-word-section").style.display = "none";
  document.getElementById("game-section").style.display = "block";
  document.getElementById("chain-list").innerHTML = `<li>${previousWord}</li>`;
  document.getElementById("score").innerText = `Score: 0`;
  startTimer();
}

function submitWord() {
  let input = document.getElementById("word-input");
  let newWord = input.value.trim().toLowerCase();

  if (!newWord) return;

  let lastChar = previousWord.slice(-1).toLowerCase();
  let firstChar = newWord[0].toLowerCase();

  if (usedWords.includes(newWord)) {
    alert("This word has already been used!");
    return;
  }

  if (firstChar !== lastChar) {
    alert(`The word must start with '${lastChar}'`);
    return;
  }

  validateWord(newWord).then(isValid => {
    if (!isValid) {
      alert("This word is not valid!");
    } else {
      usedWords.push(newWord);
      previousWord = newWord;
      document.getElementById("previous-word").innerText = newWord;
      document.getElementById("chain-list").innerHTML += `<li>${newWord}</li>`;
      input.value = "";
      score++;
      document.getElementById("score").innerText = `Score: ${score}`;
    }
  });
}

function validateWord(word) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.ok)
    .catch(() => false);
}

function startTimer() {
  let time = timeLimit;
  document.getElementById("timer").innerText = `Time left: ${time} seconds`;

  timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = `Time left: ${time} seconds`;
    if (time <= 0) {
      clearInterval(timer);
      alert(`Time’s up! Your score is: ${score}`);
      location.reload();
    }
  }, 1000);
}
