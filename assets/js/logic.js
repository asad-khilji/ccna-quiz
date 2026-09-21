// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

function startQuiz() {
  var startScreen = document.getElementById("start-screen");
  startScreen.setAttribute("class", "start hide");

  questionsEl.removeAttribute("class");
  
  timerId = setInterval(function() {
    clockTick();
  }, 1000);
  
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  questionsEl.children[0].textContent = currentQuestion.title;
  
  while (choicesEl.hasChildNodes()) {
    choicesEl.removeChild(choicesEl.lastChild);
  }

  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choiceButton = document.createElement("button");
    choiceButton.textContent = currentQuestion.choices[i];
    choiceButton.setAttribute("value", currentQuestion.choices[i]);
    
    choiceButton.addEventListener("click", function(event) {
      questionClick(event.target.value);
    });
    
    choicesEl.appendChild(choiceButton);
  }
}

function questionClick(selectedChoice) {
  if (selectedChoice !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    feedbackEl.textContent = "Incorrect!";
  } else {
    feedbackEl.textContent = "Correct!";
  }

  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 500);

  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length || time <= 0) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  clearInterval(timerId);
  timerEl.textContent = time;

  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initialsEl.value.trim().toUpperCase();
  
  if (initials === "") {
    alert("Initials must not be blank!");
    return;
  }
  
  var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
  
  var newScore = {
    initials: initials,
    score: time
  };
  
  highscores.push(newScore);
  window.localStorage.setItem("highscores", JSON.stringify(highscores));
  
  window.location.href = "highscores.html";
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

submitBtn.onclick = saveHighscore;
startBtn.onclick = startQuiz;
initialsEl.onkeyup = checkForEnter;
