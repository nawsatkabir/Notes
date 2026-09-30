// ==================================================
//  1) LOGIN SETTINGS  (এখানে ID range আর password বদলাতে পারবে)
// ==================================================
const ID_START = 20254103082;   // প্রথম ID
const ID_END   = 20254103200;   // শেষ ID  (নিজের শেষ ID অনুযায়ী বদলাও)
const PASSWORD = "section3jindabad";


// ==================================================
//  2) SUBJECTS & NOTES  (শুধু এই অংশে note/PDF add করবে)
//
//  নতুন note add করতে:
//   - PDF file টা "pdfs" folder এ রাখো
//   - নিচে note এর ভেতরে  file: "pdfs/file-name.pdf"  লেখো
//
//  নতুন subject add করতে: একটা { name, icon, notes: [...] } block copy করো
// ==================================================
const subjects = [
  {
    name: "Data Structure",
    icon: "🧩",
    notes: [
      { title: "Introduction to Data Structure", description: "Basic Data Structure concepts and definitions.", size: "2.4 MB", file: "pdfs/ds-intro.pdf" },
      { title: "Array & Array Operations", description: "Array insertion, deletion, searching and operations.", size: "1.8 MB", file: "pdfs/ds-array.pdf" },
      { title: "Linked List", description: "Linked list memory representation and traversal.", size: "2.1 MB", file: "pdfs/ds-linked-list.pdf" }
    ]
  },
  {
    name: "Computer Architecture",
    icon: "💻",
    notes: [
      { title: "Binary Multiplication & Division", description: "Binary arithmetic with examples.", size: "1.9 MB", file: "pdfs/ca-binary.pdf" },
      { title: "MIPS Introduction", description: "MIPS, opcode and operands.", size: "2.3 MB", file: "pdfs/ca-mips.pdf" },
      { title: "CPU & Registers", description: "Basic CPU and register concepts.", size: "1.5 MB", file: "pdfs/ca-cpu.pdf" }
    ]
  },
  {
    name: "C / C++",
    icon: "💡",
    notes: [
      { title: "C++ Basic Programming", description: "Variables, input, output and conditions.", size: "1.4 MB", file: "pdfs/cpp-basic.pdf" },
      { title: "Loops & Functions", description: "For loop, while loop and functions.", size: "1.7 MB", file: "pdfs/cpp-loops.pdf" },
      { title: "Array Problems", description: "Beginner array programming problems.", size: "2.0 MB", file: "pdfs/cpp-array.pdf" }
    ]
  },
  {
    name: "Mathematics",
    icon: "📐",
    notes: [
      { title: "Functions", description: "Basic mathematical functions.", size: "1.6 MB", file: "pdfs/math-functions.pdf" },
      { title: "Mathematical Notation", description: "Basic mathematical notation.", size: "1.2 MB", file: "pdfs/math-notation.pdf" }
    ]
  }
  const subjects = [
  {
    name: "CHE 101 - Chemistry",
    icon: "🧪",
    notes: []
  },
  {
    name: "CSE 205 - Digital Logic Design",
    icon: "💻",
    notes: []
  },
  {
    name: "CSE 206 - Digital Logic Design Lab",
    icon: "🔬",
    notes: []
  },
  {
    name: "CSE 231 - Algorithms",
    icon: "🧠",
    notes: []
  },
  {
    name: "CSE 232 - Algorithms Lab",
    icon: "💻",
    notes: []
  },
  {
    name: "CSE 301 - Technical Writing and Presentation",
    icon: "📝",
    notes: []
  }
];
];


// ==================================================
//  এর নিচের code কিছু বদলানোর দরকার নেই
// ==================================================
const $ = id => document.getElementById(id);
const loginPage = $("loginPage"), mainPage = $("mainPage"), errorMessage = $("errorMessage");
const subjectContainer = $("subjectContainer"), notesSection = $("notesSection");
const notesContainer = $("notesContainer"), modal = $("modal");

let downloads = 0;
let currentNote = null;
let currentSubject = null;

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

  subject.notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <div class="file">📄</div>
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <button class="view-btn">Open note (${note.size})</button>`;
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
  $("modalInfo").textContent = "PDF · " + note.size;
  $("modalDescription").textContent = note.description;
  modal.classList.remove("hidden");
}

function closeNoteModal() { modal.classList.add("hidden"); }
$("closeModal").addEventListener("click", closeNoteModal);
modal.addEventListener("click", e => { if (e.target === modal) closeNoteModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeNoteModal(); });

$("viewBtn").addEventListener("click", () => {
  if (!currentNote || !currentNote.file) return alert("This PDF has not been added yet.");
  window.open(currentNote.file, "_blank");
});

$("downloadBtn").addEventListener("click", () => {
  if (!currentNote || !currentNote.file) return alert("This PDF has not been added yet.");
  const a = document.createElement("a");
  a.href = currentNote.file;
  a.download = currentNote.file.split("/").pop();
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
