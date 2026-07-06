
const cards = document.querySelectorAll(".card");
const sections = document.querySelectorAll(".feature-section");
const dashboard = document.getElementById("dashboard");
const backBtns = document.querySelectorAll(".back-btn");

let activeSection = null;

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    if (activeSection) return; 
    const targetId = card.getAttribute("data-target");
    openSection(targetId);
  });
});

backBtns.forEach(function (btn) {
  btn.addEventListener("click", closeSection);
});

function openSection(id) {
  dashboard.style.display = "none";
  const section = document.getElementById(id);
  section.classList.add("active");
  activeSection = section;

  if (id === "weatherSection") {
    getWeather();
  }
}

function closeSection() {
  if (activeSection) {
    activeSection.classList.remove("active");
    activeSection = null;
  }
  dashboard.style.display = "grid";
}



const dateText = document.getElementById("dateText");
const timeText = document.getElementById("timeText");

function updateClock() {
  const now = new Date();

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  dateText.textContent = dayName + ", " + date + " " + month + " " + year;

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minStr = minutes < 10 ? "0" + minutes : minutes;
  const secStr = seconds < 10 ? "0" + seconds : seconds;

  timeText.textContent = hours + ":" + minStr + ":" + secStr + " " + ampm;

  setBackground(now.getHours());
}

updateClock();
setInterval(updateClock, 1000);



function setBackground(hour) {
  const body = document.body;
  body.classList.remove("morning", "afternoon", "evening", "night");

  if (hour >= 5 && hour < 12) {
    body.classList.add("morning");
  } else if (hour >= 12 && hour < 17) {
    body.classList.add("afternoon");
  } else if (hour >= 17 && hour < 21) {
    body.classList.add("evening");
  } else {
    body.classList.add("night");
  }
}



const themeBtn = document.getElementById("themeBtn");

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
}

function changeTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙";
  }
}

themeBtn.addEventListener("click", changeTheme);
loadTheme();



const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");
const todoList = document.getElementById("todoList");

let todoData = [];

function loadTodo() {
  const saved = localStorage.getItem("todoData");
  if (saved) {
    todoData = JSON.parse(saved);
  }
  showTodo();
}

function saveTodo() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

function addTask() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Please type a task first.");
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    done: false,
    important: false
  };

  todoData.push(task);
  saveTodo();
  showTodo();
  todoInput.value = "";
}

function showTodo() {
  todoList.innerHTML = "";

  todoData.forEach(function (task) {
    const item = document.createElement("li");
    item.dataset.id = task.id;

    if (task.done) item.classList.add("done");
    if (task.important) item.classList.add("important");

    item.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="btn-group">
        <button class="importantBtn">⭐</button>
        <button class="doneBtn">✔</button>
        <button class="deleteBtn">🗑</button>
      </div>
    `;

    todoList.appendChild(item);
  });
}

todoAddBtn.addEventListener("click", addTask);

todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

todoList.addEventListener("click", function (e) {
  const item = e.target.closest("li");
  if (!item) return;

  const id = Number(item.dataset.id);
  const task = todoData.find(function (t) { return t.id === id; });
  if (!task) return;

  if (e.target.classList.contains("doneBtn")) {
    task.done = !task.done;
  } else if (e.target.classList.contains("importantBtn")) {
    task.important = !task.important;
  } else if (e.target.classList.contains("deleteBtn")) {
    todoData = todoData.filter(function (t) { return t.id !== id; });
  }

  saveTodo();
  showTodo();
});

loadTodo();



const plannerList = document.getElementById("plannerList");
let plannerData = {};

function buildPlanner() {
  const saved = localStorage.getItem("plannerData");
  if (saved) {
    plannerData = JSON.parse(saved);
  }

  plannerList.innerHTML = "";
  const currentHour = new Date().getHours();

  for (let hour = 6; hour <= 22; hour++) {
    const row = document.createElement("div");
    row.classList.add("planner-row");
    if (hour === currentHour) row.classList.add("current");

    const label = hour > 12 ? (hour - 12) + " PM" : hour === 12 ? "12 PM" : hour + " AM";

    const savedText = plannerData[hour] ? plannerData[hour] : "";

    row.innerHTML = `
      <span class="planner-time">${label}</span>
      <input type="text" data-hour="${hour}" placeholder="Add a plan..." value="${savedText}">
    `;

    plannerList.appendChild(row);
  }
}

plannerList.addEventListener("input", function (e) {
  if (e.target.tagName === "INPUT") {
    const hour = e.target.dataset.hour;
    const text = e.target.value;

    if (text.trim() === "") {
      delete plannerData[hour];
    } else {
      plannerData[hour] = text;
    }

    localStorage.setItem("plannerData", JSON.stringify(plannerData));
  }
});

buildPlanner();



const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteBtn = document.getElementById("quoteBtn");

async function getQuote() {
  quoteText.textContent = "Loading quote...";
  quoteAuthor.textContent = "";

  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    console.log(res);
    
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    quoteText.textContent = data.quote;
    quoteAuthor.textContent = "- " + data.author
;
  } catch (err) {
    quoteText.textContent = "Could not load a quote right now. Stay motivated anyway!";
    quoteAuthor.textContent = "";
    
  }
}

quoteBtn.addEventListener("click", getQuote);



const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionLabel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const workTime = 25 * 60;
const breakTime = 5 * 60;

let timeLeft = workTime;
let isBreak = false;
let timer = null;

function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const secLeft = sec % 60;
  const minStr = min < 10 ? "0" + min : min;
  const secStr = secLeft < 10 ? "0" + secLeft : secLeft;
  return minStr + ":" + secStr;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
  if (timer) return;

  timer = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      isBreak = !isBreak;
      timeLeft = isBreak ? breakTime : workTime;
      sessionLabel.textContent = isBreak ? "Break Time" : "Work Session";
      updateTimerDisplay();
      alert(isBreak ? "Work session done! Time for a break." : "Break over! Back to work.");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isBreak = false;
  timeLeft = workTime;
  sessionLabel.textContent = "Work Session";
  updateTimerDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateTimerDisplay();



const weatherLocation = document.getElementById("weatherLocation");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherExtra = document.getElementById("weatherExtra");

function getConditionText(code) {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

async function fetchWeather(lat, lon, name) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather request failed");

    const data = await res.json();
    const current = data.current;

    weatherLocation.textContent = name;
    weatherTemp.textContent = Math.round(current.temperature_2m) + "°C";
    weatherCondition.textContent = getConditionText(current.weather_code);
    weatherExtra.textContent = "Humidity: " + current.relative_humidity_2m + "% | Wind: " + current.wind_speed_10m + " km/h";
  } catch (err) {
    weatherLocation.textContent = "Weather unavailable";
    weatherTemp.textContent = "";
    weatherCondition.textContent = "Could not load weather data.";
    weatherExtra.textContent = "";
  }
}

function getWeather() {
  weatherLocation.textContent = "Loading location...";
  weatherTemp.textContent = "";
  weatherCondition.textContent = "";
  weatherExtra.textContent = "";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your Location");
      },
      function () {
        fetchWeather(28.6139, 77.2090, "New Delhi (default)");
      }
    );
  } else {
    fetchWeather(28.6139, 77.2090, "New Delhi (default)");
  }
}



const goalInput = document.getElementById("goalInput");
const goalAddBtn = document.getElementById("goalAddBtn");
const goalList = document.getElementById("goalList");
const goalProgress = document.getElementById("goalProgress");

let goalData = [];

function loadGoal() {
  const saved = localStorage.getItem("goalData");
  if (saved) {
    goalData = JSON.parse(saved);
  }
  showGoal();
}

function saveGoal() {
  localStorage.setItem("goalData", JSON.stringify(goalData));
}

function addGoal() {
  const text = goalInput.value.trim();

  if (text === "") {
    alert("Please type a goal first.");
    return;
  }

  const goal = {
    id: Date.now(),
    text: text,
    done: false
  };

  goalData.push(goal);
  saveGoal();
  showGoal();
  goalInput.value = "";
}

function showGoal() {
  goalList.innerHTML = "";

  goalData.forEach(function (goal) {
    const item = document.createElement("li");
    item.dataset.id = goal.id;
    if (goal.done) item.classList.add("done");

    item.innerHTML = `
      <span class="task-text">${goal.text}</span>
      <div class="btn-group">
        <button class="doneBtn">✔</button>
        <button class="deleteBtn">🗑</button>
      </div>
    `;

    goalList.appendChild(item);
  });

  updateGoalProgress();
}

function updateGoalProgress() {
  const total = goalData.length;
  const completed = goalData.filter(function (g) { return g.done; }).length;
  goalProgress.textContent = completed + " of " + total + " completed";
}

goalAddBtn.addEventListener("click", addGoal);

goalInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addGoal();
  }
});

goalList.addEventListener("click", function (e) {
  const item = e.target.closest("li");
  if (!item) return;

  const id = Number(item.dataset.id);
  const goal = goalData.find(function (g) { return g.id === id; });
  if (!goal) return;

  if (e.target.classList.contains("doneBtn")) {
    goal.done = !goal.done;
  } else if (e.target.classList.contains("deleteBtn")) {
    goalData = goalData.filter(function (g) { return g.id !== id; });
  }

  saveGoal();
  showGoal();
});

loadGoal();