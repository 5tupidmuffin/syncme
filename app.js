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
const player = document.querySelector("#music");
const label = document.querySelector("label");
const modal = document.querySelector(".modal");
let isModalOpen = false;

const displayVerse = (lyricsArray, lineNo) => {
  if (lyricsArray[lineNo]) {
    verse.value = lyricsArray[lineNo];
  } else {
    clearInterval(flag);
    isRunning = false;
  }
};

// Button Events
lyrics.onpaste = () => {
  setTimeout(() => {
    lrc = lyrics.value;
    displayVerse(lrc.split("\n"), currentLine);
  }, 20);
};

const displayModal = (message) => {
  if (isModalOpen) {
    return;
  }
  isModalOpen = true;
  modal.textContent = message;
  modal.style.display = "inherit";
  setTimeout(() => {
    modal.style.display = "none";
    isModalOpen = false;
  }, 5 * 1000);
};

start.onclick = () => {
  if (!lyrics.value) {
    alert("add lyrics first!");
    return;
  }

  if (isRunning) {
    return;
  }

  if (player.currentSrc) {
    player.play();
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
    stamp.textContent = `${mins <= 9 ? "0" + mins : mins}:${
      secs <= 9 ? "0" + secs : secs
    }.${millis / 10 <= 9 ? "0" + millis / 10 : millis / 10}`;
  }, 10);
};

reset.onclick = () => {
  isRunning = false;
  clearInterval(flag);
  stamp.textContent = "00:00.00";
  synced_lyrics.value = "";
  currentLine = 0;
  if (player.currentSrc) {
    player.currentTime = 0;
    player.pause();
  }
};

sync.onclick = () => {
  if (!lyrics.value) {
    alert("add lyrics first!");
    return;
  }
  if (!isRunning) {
    return;
  }

  synced_lyrics.value += `[${stamp.textContent}] ${verse.value}\n`;
  displayVerse(lrc.split("\n"), (currentLine += 1));
  synced_lyrics.scrollTop = synced_lyrics.scrollHeight;
};

cpbtn.onclick = () => {
  if (synced_lyrics.value) {
    navigator.clipboard.writeText(synced_lyrics.value);
    displayModal("Synced Lyrics Copied!");
  } else {
    alert("Nothing to Copy!");
  }
};

// audio upload event
const audioUploaded = (e) => {
  player.src = URL.createObjectURL(e.target.files[0]);
  player.load();
  label.textContent = "Uploaded!";
  player.style.visibility = "visible";
  displayModal("Hit Start Button to Start Timer and Audio simultaneously");
  player.onload = function () {
    URL.revokeObjectURL(player.src); // free memory
  };
};
