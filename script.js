// ==================================================
//  1) LOGIN SETTINGS  (ekhane ID range ar password bodlate parbe)
// ==================================================
const ID_START = 20254103082;   // prothom ID
const ID_END   = 20254103200;   // shesh ID
const PASSWORD = "section3jindabad";


// ==================================================
//  2) SUBJECTS & NOTES  (shudhu ekhane note add korbe)
//
//  Notun note add korte: nicher line ta copy kore, subject er notes: [ ] er moddhe paste koro
//
//     { title: "Note er naam", file: "pdf-file-er-naam.pdf" },
//
//  - Ekadhik note hole proti note er pore comma (,) thakbe
//  - PDF file ta GitHub er "pdfs" folder e upload korte hobe
//  - Chaile description ar size o dite paro:
//     { title: "Note er naam", file: "abc.pdf", description: "Short details", size: "2 MB" },
// ==================================================
const subjects = [

  {
    name: "CHE 101 - Chemistry",
    icon: "🧪",
    notes: [
      { title: "Chemistry Chapter 1", file: "che-chapter-1.pdf" },      // { title: "Note er naam", file: "che-note-1.pdf" },
    ]
  },

  {
    name: "CSE 205 - Digital Logic Design",
    icon: "💻",
    notes: [
      // { title: "Note er naam", file: "dld-note-1.pdf" },
    ]
  },

  {
    name: "CSE 206 - Digital Logic Design Lab",
    icon: "🔬",
    notes: [
      // { title: "Note er naam", file: "dld-lab-1.pdf" },
    ]
  },

  {
    name: "CSE 231 - Algorithms",
    icon: "🧠",
    notes: [
      // { title: "Note er naam", file: "algo-note-1.pdf" },
    ]
  },

  {
    name: "CSE 232 - Algorithms Lab",
    icon: "💻",
    notes: [
      // { title: "Note er naam", file: "algo-lab-1.pdf" },
    ]
  },

  {
    name: "CSE 301 - Technical Writing and Presentation",
    icon: "📝",
    notes: [
      // { title: "Note er naam", file: "tech-writing-1.pdf" },
    ]
  }
  {
  name:"CSE 100 - Object oriented and programing language",
  icon:"📝",
  notes:[
    // { title: "Note er naam", file: "tech-writing-1.pdf" },
    ]
},
];


// ==================================================
//  Er niche er code kichu bodlanor dorkar nei
// ==================================================
const $ = id => document.getElementById(id);
const loginPage = $("loginPage"), mainPage = $("mainPage"), errorMessage = $("errorMessage");
const subjectContainer = $("subjectContainer"), notesSection = $("notesSection");
const notesContainer = $("notesContainer"), modal = $("modal");

let downloads = 0;
let currentNote = null;
let currentSubject = null;

// file: "abc.pdf" likhlei hobe, "pdfs/" automatic jure jabe
function filePath(note) {
  if (!note || !note.file) return "";
  return note.file.includes("/") ? note.file : "pdfs/" + note.file;
}

// ---------- LOGIN ----------
function checkLogin(id, pass) {
  if (!/^\d+$/.test(id)) return false;
  const n = Number(id);
  return n >= ID_START && n <= ID_END && pass === PASSWORD;
}

$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("studentId").value.trim();
  const pass = $("password").value;

  if (checkLogin(id, pass)) {
    errorMessage.textContent = "";
    sessionStorage.setItem("uninotes_user", id);
    enterSite(id);
  } else {
    errorMessage.textContent = "Wrong Student ID or password. Please try again.";
  }
});

function enterSite(id) {
  loginPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  $("studentName").textContent = "ID: " + id;
  showSubjects();
  updateStats();
}

// stay logged in on refresh (same tab)
try {
  const saved = sessionStorage.getItem("uninotes_user");
  if (saved) enterSite(saved);
} catch (e) {}

$("logoutBtn").addEventListener("click", () => {
  try { sessionStorage.removeItem("uninotes_user"); } catch (e) {}
  mainPage.classList.add("hidden");
  notesSection.classList.add("hidden");
  loginPage.classList.remove("hidden");
  $("loginForm").reset();
});

// ---------- SUBJECTS ----------
function showSubjects(list = subjects) {
  subjectContainer.innerHTML = "";
  if (!list.length) {
    subjectContainer.innerHTML = '<div class="empty">No subject or note matches your search.</div>';
    return;
  }
  list.forEach(subject => {
    const card = document.createElement("button");
    card.className = "subject-card" + (subject === currentSubject ? " active" : "");
    card.innerHTML = `
      <div class="subject-icon">${subject.icon}</div>
      <h3>${subject.name}</h3>
      <p>${subject.notes.length} ${subject.notes.length === 1 ? "note" : "notes"} available</p>`;
    card.addEventListener("click", () => showNotes(subject));
    subjectContainer.appendChild(card);
  });
}

// ---------- NOTES ----------
function showNotes(subject) {
  currentSubject = subject;
  notesSection.classList.remove("hidden");
  $("notesTitle").textContent = subject.name;
  $("notesSubtitle").textContent = subject.notes.length + (subject.notes.length === 1 ? " note" : " notes") + " available";
  notesContainer.innerHTML = "";
  if (!subject.notes.length) {
    notesContainer.innerHTML = '<div class="empty">No notes added for this subject yet.</div>';
  }

  subject.notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <div class="file">📄</div>
      <h3>${note.title}</h3>
      <p>${note.description || "PDF note"}</p>
      <button class="view-btn">Open note${note.size ? " (" + note.size + ")" : ""}</button>`;
    card.querySelector(".view-btn").addEventListener("click", () => openNote(note));
    notesContainer.appendChild(card);
  });

  showSubjects(filterSubjects($("searchInput").value));
  notesSection.scrollIntoView({ behavior: "smooth" });
}

$("backBtn").addEventListener("click", () => {
  currentSubject = null;
  notesSection.classList.add("hidden");
  showSubjects(filterSubjects($("searchInput").value));
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- MODAL ----------
function openNote(note) {
  currentNote = note;
  $("modalTitle").textContent = note.title;
  $("modalInfo").textContent = "PDF" + (note.size ? " · " + note.size : "");
  $("modalDescription").textContent = note.description || "";
  modal.classList.remove("hidden");
}

function closeNoteModal() { modal.classList.add("hidden"); }
$("closeModal").addEventListener("click", closeNoteModal);
modal.addEventListener("click", e => { if (e.target === modal) closeNoteModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeNoteModal(); });

$("viewBtn").addEventListener("click", () => {
  if (!filePath(currentNote)) return alert("This PDF has not been added yet.");
  window.open(filePath(currentNote), "_blank");
});

$("downloadBtn").addEventListener("click", () => {
  if (!filePath(currentNote)) return alert("This PDF has not been added yet.");
  const a = document.createElement("a");
  a.href = filePath(currentNote);
  a.download = filePath(currentNote).split("/").pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
  downloads++;
  $("downloadCount").textContent = downloads;
});

// ---------- SEARCH ----------
function filterSubjects(text) {
  const q = (text || "").toLowerCase().trim();
  if (!q) return subjects;
  return subjects.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.notes.some(n => n.title.toLowerCase().includes(q))
  );
}
$("searchInput").addEventListener("input", e => showSubjects(filterSubjects(e.target.value)));

// ---------- STATS ----------
function updateStats() {
  $("subjectCount").textContent = subjects.length;
  $("noteCount").textContent = subjects.reduce((t, s) => t + s.notes.length, 0);
  $("downloadCount").textContent = downloads;
}
