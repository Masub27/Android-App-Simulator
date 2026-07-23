const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = {
  lesson: 1,
  shot: 0,
  mode: "watch",
  running: false,
  paused: false,
  voice: true,
  speed: 1,
  timers: [],
  completed: new Set()
};

const els = {
  lessonSelect: $("#lessonSelect"),
  progress: $("#progressFill"),
  lessonNumber: $("#lessonNumber"),
  title: $("#lessonTitle"),
  goal: $("#lessonGoal"),
  result: $("#expectedResult"),
  action: $("#currentAction"),
  subtitle: $("#subtitles"),
  bubble: $("#speechBubble"),
  chapter: $("#chapterName"),
  sceneTitle: $("#sceneTitle"),
  frame: $("#cameraFrame"),
  cursor: $("#cursor"),
  focus: $("#focusRing"),
  terminalHistory: $("#terminalHistory"),
  terminalTyping: $("#terminalTyping"),
  tree: $("#projectTree"),
  code: $("#codeEditor"),
  tab: $("#editorTab"),
  build: $("#buildPanel"),
  phoneText: $("#phoneText"),
  installBar: $("#installBar span"),
  achievement: $("#achievement"),
  practiceInstruction: $("#practiceInstruction"),
  practiceFeedback: $("#practiceFeedback"),
  quizBox: $("#quizBox"),
  quizFeedback: $("#quizFeedback")
};

LESSONS.forEach(l => {
  const o = document.createElement("option");
  o.value = l.id;
  o.textContent = `${l.id}. ${l.title}`;
  els.lessonSelect.appendChild(o);
});

function lesson() {
  return LESSONS.find(l => l.id === state.lesson);
}

function clearTimers() {
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

function later(fn, ms) {
  const id = setTimeout(fn, ms * state.speed);
  state.timers.push(id);
  return id;
}

function speak(text) {
  if (!state.voice || !("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = .88;
  u.pitch = 1;
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

function setMode(mode) {
  state.mode = mode;
  $("#modeLabel").textContent = `${mode[0].toUpperCase() + mode.slice(1)} Mode`;
  $$(".mode-card").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  if (mode === "practice") openTab("practice");
  else if (mode === "quiz") openTab("quiz");
  else openTab("guide");
}

function openTab(name) {
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
  $$(".tab-content").forEach(t => t.classList.toggle("active", t.id === `${name}Tab`));
}

function loadLesson(id) {
  clearTimers();
  state.running = false;
  state.paused = false;
  state.lesson = Math.max(1, Math.min(LESSONS.length, Number(id)));
  state.shot = 0;
  const l = lesson();

  els.lessonSelect.value = l.id;
  els.lessonNumber.textContent = `LESSON ${String(l.id).padStart(2, "0")}`;
  els.title.textContent = l.title;
  els.goal.textContent = l.goal;
  els.result.textContent = l.result;
  els.chapter.textContent = l.title;
  els.sceneTitle.textContent = l.title;
  els.action.textContent = "Ready";
  els.subtitle.textContent = "Press Play to begin this lesson.";
  els.bubble.textContent = "I will demonstrate every step clearly.";
  els.progress.style.width = `${((l.id - 1) / LESSONS.length) * 100}%`;

  resetScreen();
  renderChapterList();
  renderPractice();
  renderQuiz();

  const url = new URL(location.href);
  url.searchParams.set("lesson", state.lesson);
  history.replaceState({}, "", url);
}

function resetScreen() {
  showView("desktop");
  els.terminalHistory.textContent = "";
  els.terminalTyping.textContent = "";
  els.tree.textContent = "";
  els.code.textContent = "";
  els.build.textContent = "";
  els.phoneText.textContent = "Android device ready";
  els.installBar.style.width = "0%";
  els.frame.className = "shot-wide";
  els.cursor.classList.remove("show");
  els.focus.classList.remove("show");
  $("#successBurst").classList.remove("show");
}

function showView(name) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $(`#${name}View`).classList.add("active");
  $("#windowTitle").textContent = {
    desktop: "Training Desktop",
    terminal: "Terminal",
    android: "Android Studio",
    browser: "LiaScript Course",
    phone: "Android Device"
  }[name];
}

function camera(shot) {
  els.frame.className = `shot-${shot}`;
}

function cursorTarget(target) {
  const map = {
    studio: [24, 29],
    terminal: [44, 29],
    browser: [64, 29],
    phone: [82, 29]
  };
  const [x, y] = map[target] || [50, 50];
  els.cursor.style.left = `${x}%`;
  els.cursor.style.top = `${y}%`;
  els.cursor.classList.add("show");
  els.focus.style.left = `calc(${x}% - 22px)`;
  els.focus.style.top = `calc(${y}% - 22px)`;
  els.focus.classList.add("show");
}

function typeText(el, text, speed = 22, done) {
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (!state.running || state.paused) return;
    el.textContent += text[i++] || "";
    if (i <= text.length) later(tick, speed);
    else if (done) done();
  };
  tick();
}

function present(shot, index) {
  state.shot = index;
  els.action.textContent = shot.action || "Watch the demonstration";
  els.subtitle.textContent = shot.caption || shot.text || "";
  els.bubble.textContent = shot.caption || shot.text || "";
  speak(shot.caption || shot.text || "");

  switch (shot.type) {
    case "camera":
      camera(shot.shot);
      break;
    case "speak":
      break;
    case "show":
      showView(shot.view);
      camera(shot.view === "phone" ? "phone" : "monitor");
      break;
    case "cursor":
      showView("desktop");
      camera("monitor");
      cursorTarget(shot.target);
      break;
    case "tree":
      showView("android");
      camera("monitor");
      typeText(els.tree, shot.text, 18);
      break;
    case "code":
      showView("android");
      camera("code");
      els.tab.textContent = shot.tab;
      typeText(els.code, shot.text, 12);
      break;
    case "highlight":
      showView("android");
      camera("code");
      els.focus.style.left = "38%";
      els.focus.style.top = "31%";
      els.focus.classList.add("show");
      break;
    case "build":
      showView("android");
      camera("monitor");
      typeText(els.build, shot.text, 18);
      break;
    case "type":
      showView("terminal");
      camera("terminal");
      typeText(els.terminalTyping, shot.command, 55, () => {
        later(() => {
          els.terminalHistory.textContent += `student@macbook % ${shot.command}\n${shot.output}\n`;
          els.terminalTyping.textContent = "";
        }, 450);
      });
      break;
    case "install":
      showView("phone");
      camera("phone");
      els.installBar.style.width = "100%";
      els.phoneText.textContent = "Installing app…";
      later(() => els.phoneText.textContent = "Application installed", 1600);
      break;
    case "phone":
      showView("phone");
      camera("phone");
      els.phoneText.textContent = shot.text;
      break;
    case "success":
      $("#successBurst").classList.add("show");
      camera("wide");
      break;
  }

  els.progress.style.width =
    `${(((state.lesson - 1) + (index + 1) / lesson().shots.length) / LESSONS.length) * 100}%`;
}

function play() {
  if (state.mode === "practice") {
    openTab("practice");
    return;
  }
  if (state.mode === "quiz") {
    openTab("quiz");
    return;
  }

  clearTimers();
  state.running = true;
  state.paused = false;
  const shots = lesson().shots;
  let i = state.shot;

  const runNext = () => {
    if (!state.running || state.paused) return;
    if (i >= shots.length) {
      completeLesson();
      return;
    }
    present(shots[i], i);
    i++;
    later(runNext, 4300);
  };
  runNext();
}

function pause() {
  state.paused = true;
  state.running = false;
  clearTimers();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  els.subtitle.textContent = "Paused. Press Play to continue.";
}

function replay() {
  loadLesson(state.lesson);
  later(play, 250);
}

function completeLesson() {
  state.running = false;
  state.completed.add(state.lesson);
  els.achievement.textContent = `🏆 Lesson ${state.lesson} completed`;
  els.achievement.classList.add("show");
  later(() => els.achievement.classList.remove("show"), 2500);
  els.subtitle.textContent = "Lesson completed. Continue to Practice Mode or the next lesson.";
  els.action.textContent = "Lesson completed";
  $("#successBurst").classList.add("show");
}

function renderChapterList() {
  const box = $("#chapterList");
  box.innerHTML = "";
  LESSONS.forEach(l => {
    const item = document.createElement("button");
    item.className = `chapter-item ${l.id === state.lesson ? "active" : ""}`;
    item.innerHTML = `<span>${String(l.id).padStart(2, "0")}</span><b>${l.title}</b>`;
    item.onclick = () => loadLesson(l.id);
    box.appendChild(item);
  });
}

function renderPractice() {
  const l = lesson();
  els.practiceInstruction.textContent =
    `Repeat the key action from “${l.title}”: ${l.shots[l.shots.length - 1].action}`;
  els.practiceFeedback.textContent = "";
}

function renderQuiz() {
  const q = lesson().quiz;
  els.quizBox.innerHTML = `<p class="question">${q.question}</p>` +
    q.options.map((o, i) =>
      `<label><input type="radio" name="quiz" value="${i}"> ${o}</label>`
    ).join("");
  els.quizFeedback.textContent = "";
}

$("#practiceAction").onclick = () => {
  els.practiceFeedback.textContent = "✓ Practice step completed. You may continue to the quiz.";
  els.practiceFeedback.className = "good";
};

$("#submitQuiz").onclick = () => {
  const selected = $('input[name="quiz"]:checked');
  if (!selected) {
    els.quizFeedback.textContent = "Select one answer first.";
    els.quizFeedback.className = "warn";
    return;
  }
  if (Number(selected.value) === lesson().quiz.correct) {
    els.quizFeedback.textContent = "✓ Correct answer.";
    els.quizFeedback.className = "good";
  } else {
    els.quizFeedback.textContent = "Not correct. Review the animated lesson and try again.";
    els.quizFeedback.className = "bad";
  }
};

$("#startTraining").onclick = () => {
  $("#welcome").style.display = "none";
  if (state.mode === "watch") later(play, 500);
};

$$(".mode-card").forEach(b => b.onclick = () => setMode(b.dataset.mode));
$$(".tab").forEach(b => b.onclick = () => openTab(b.dataset.tab));

$("#playBtn").onclick = play;
$("#pauseBtn").onclick = pause;
$("#replayBtn").onclick = replay;
$("#voiceBtn").onclick = () => {
  state.voice = !state.voice;
  $("#voiceBtn").textContent = state.voice ? "🔊 Voice" : "🔇 Muted";
};
$("#fullBtn").onclick = () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};
$("#prevStep").onclick = () => {
  state.shot = Math.max(0, state.shot - 1);
  present(lesson().shots[state.shot], state.shot);
};
$("#nextStep").onclick = () => {
  state.shot = Math.min(lesson().shots.length - 1, state.shot + 1);
  present(lesson().shots[state.shot], state.shot);
};
$("#lessonSelect").onchange = e => loadLesson(e.target.value);
$("#speedSelect").onchange = e => state.speed = Number(e.target.value);

const first = Number(new URL(location.href).searchParams.get("lesson")) || 1;
loadLesson(first);