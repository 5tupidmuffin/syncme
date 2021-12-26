// input fields
const lyrics = document.querySelector("#original_lrc");
const verse = document.querySelector("#verse");
const stamp = document.querySelector("#timestamp");
const synced_lyrics = document.querySelector("#synced_lrc");

// button
const start = document.querySelector("#start");
const reset = document.querySelector("#reset");
const sync = document.querySelector("#sync");
const cpbtn = document.querySelector("#cpbtn");

// other
let flag = null;
let isRunning = false;
let lrc = "";
let currentLine = 0;

const displayVerse = (lyricsArray, lineNo) => {
  if (lyricsArray[lineNo]) {
    verse.value = lyricsArray[lineNo];
  } else {
    clearInterval(flag);
  }
};

// Button Events
lyrics.onpaste = () => {
  setTimeout(() => {
    lrc = lyrics.value;
    displayVerse(lrc.split("\n"), currentLine);
  }, 20);
};

start.onclick = () => {
  if (!lyrics.value) {
    alert("add lyrics first!");
    return;
  }
  setTimeout(() => {
    lrc = lyrics.value;
    displayVerse(lrc.split("\n"), currentLine);
  }, 20);

  let mins = 0,
    secs = 0,
    millis = 0;
  isRunning = true;
  flag = setInterval(() => {
    millis += 10;
    if (millis === 1000) {
      millis = 0;
      secs += 1;
    }
    if (secs === 60) {
      secs = 0;
      mins += 1;
    }
    stamp.textContent = `${mins < 9 ? "0" + mins : mins}:${
      secs < 9 ? "0" + secs : secs
    }.${millis / 10 < 9 ? "0" + millis / 10 : millis / 10}`;
  }, 10);
};

reset.onclick = () => {
  isRunning = false;
  clearInterval(flag);
  stamp.textContent = "00:00.00";
  synced_lyrics.value = "";
  currentLine = 0;
};

sync.onclick = () => {
  if (!lyrics.value) {
    alert("add lyrics first!");
    return;
  }
  if (!isRunning) {
    alert("Start The Clock First!");
    return;
  }

  synced_lyrics.value += `[${stamp.textContent}] ${verse.value}\n`;
  displayVerse(lrc.split("\n"), (currentLine += 1));
};

cpbtn.onclick = () => {
  if (synced_lyrics.value) {
    navigator.clipboard.writeText(synced_lyrics.value);
  } else {
    alert("Nothing to Copy!");
  }
};
